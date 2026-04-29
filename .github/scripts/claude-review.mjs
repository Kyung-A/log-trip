/**
 * Claude를 이용해 PR 코드리뷰를 수행하는 스크립트
 *
 * 입력:
 *   pr.diff        - 리뷰할 diff 파일
 *   prev_review.txt - (재리뷰 시) 이전 Claude 리뷰 본문
 *
 * 출력: review-result.json
 *   { severity, githubEvent, body }
 *
 * 실행 환경변수:
 *   ANTHROPIC_API_KEY  - Claude API 키
 *   IS_FIRST_REVIEW    - "true" | "false"
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync } from "fs";

// ─────────────────────────────────────────────
// Claude API 실패 시 사용하는 폴백 결과
// → PR에 "리뷰 불가" 안내 댓글만 남기고 머지는 보류
// ─────────────────────────────────────────────
function buildSkippedResult() {
  return {
    severity: "SKIPPED",
    githubEvent: "COMMENT",
    body: [
      "<!-- claude-review -->",
      "## ⚠️ Claude 코드리뷰 실패",
      "",
      "Claude API를 사용할 수 없어 코드리뷰를 진행하지 못했습니다.",
      "API 크레딧을 확인하거나, `/not-reviewed` 커맨드로 나중에 재실행해주세요.",
      "",
      "_머지는 수동으로 진행해주세요._",
    ].join("\n"),
  };
}

// API 키 없으면 즉시 폴백
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("[코드리뷰] ANTHROPIC_API_KEY 없음 → 스킵");
  writeFileSync("review-result.json", JSON.stringify(buildSkippedResult(), null, 2));
  process.exit(0);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const isFirstReview = process.env.IS_FIRST_REVIEW !== "false";

// diff 파일 읽기
let diff;
try {
  diff = readFileSync("pr.diff", "utf-8").trim();
} catch {
  diff = "";
}

if (!diff) {
  writeFileSync("review-result.json", JSON.stringify({
    severity: "APPROVED",
    githubEvent: "APPROVE",
    body: "<!-- claude-review -->\n## ✅ Claude 코드리뷰 — 승인\n\n변경사항이 없습니다.",
  }, null, 2));
  process.exit(0);
}

// diff가 너무 길면 앞부분만 전달 (토큰 한도 초과 방지)
const MAX_DIFF = 40_000;
const truncatedDiff =
  diff.length > MAX_DIFF
    ? diff.slice(0, MAX_DIFF) + "\n\n_(diff가 너무 길어 일부 생략됨)_"
    : diff;

// 재리뷰 시 이전 리뷰 내용 읽기
let prevReview = "";
if (!isFirstReview) {
  try {
    prevReview = readFileSync("prev_review.txt", "utf-8").trim();
  } catch {
    // 파일이 없으면 첫 리뷰처럼 처리
  }
}

// ─────────────────────────────────────────────
// 시스템 프롬프트 (고정 내용 → 프롬프트 캐싱 적용)
// 같은 API 키로 반복 호출 시 이 부분은 캐시에서 읽어 토큰 절약
// ─────────────────────────────────────────────
const SYSTEM_PROMPT = `당신은 경험 많은 시니어 풀스택 개발자로서 PR 코드리뷰를 진행합니다.

**프로젝트 정보:**
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (인증 + DB)
- Feature-Sliced Design (FSD) 아키텍처
  - import 방향: app → widgets → features → entities → shared (단방향 엄수)
  - 같은 레이어 간 import 절대 금지 (예: feature → feature)
- React 19, Mapbox GL, react-hook-form

**심각도 기준:**
- CRITICAL: 보안 취약점(XSS/CSRF/SQL Injection 등), 민감 정보 노출, 데이터 손실 위험, 서비스 중단 가능성, 심각한 로직 오류 → 반드시 수정 후 머지
- MINOR: FSD 아키텍처 위반, 잠재적 버그, 성능 문제, 코드 품질 → 수정 권장, 머지는 가능
- APPROVED: 이슈 없음 또는 SUGGESTION만 있음 → 즉시 머지 가능

**최종 severity 판단:**
- CRITICAL 이슈가 하나라도 있으면 → severity: CRITICAL
- CRITICAL 없고 MINOR 이상 이슈 있으면 → severity: MINOR
- 이슈 없거나 SUGGESTION만 있으면 → severity: APPROVED`;

// ─────────────────────────────────────────────
// 사용자 메시지 구성
// 첫 리뷰: diff만 전달
// 재리뷰: 이전 리뷰 내용 + 새 diff 전달
//   → "이전 이슈를 잘 수정했는지" 중심으로 판단하게 함
// ─────────────────────────────────────────────
const userContent = isFirstReview
  ? `아래 PR diff를 리뷰해주세요.\n\n\`\`\`diff\n${truncatedDiff}\n\`\`\``
  : `이전 코드리뷰 내용과 그 이후 추가된 변경사항을 함께 검토해주세요.

**이전 리뷰에서 지적한 이슈:**
${prevReview}

**이전 리뷰 이후 새로 추가된 변경사항:**
\`\`\`diff
${truncatedDiff}
\`\`\`

이전 이슈들이 제대로 수정되었는지 확인하고, 새로운 변경사항에 추가 이슈가 있는지 검토해주세요.`;

// ─────────────────────────────────────────────
// Claude 호출
// ─────────────────────────────────────────────
try {
  const response = await client.messages.create({
    // 토큰 절약을 위해 Haiku 사용 (코드리뷰에 충분한 성능)
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    // 시스템 프롬프트에 캐싱 적용 → 반복 호출 시 이 부분 토큰 절약
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [
      {
        name: "submit_review",
        description: "코드리뷰 결과를 구조화된 형식으로 제출합니다",
        input_schema: {
          type: "object",
          required: ["severity", "summary", "issues"],
          properties: {
            severity: {
              type: "string",
              enum: ["CRITICAL", "MINOR", "APPROVED"],
            },
            summary: {
              type: "string",
              description: "전체 리뷰 요약 (한국어, 마크다운)",
            },
            issues: {
              type: "array",
              description: "발견된 이슈 목록 (없으면 빈 배열)",
              items: {
                type: "object",
                required: ["level", "file", "description"],
                properties: {
                  level: {
                    type: "string",
                    enum: ["CRITICAL", "WARNING", "SUGGESTION"],
                  },
                  file: { type: "string" },
                  description: { type: "string", description: "이슈 설명 (한국어)" },
                  suggestion: { type: "string", description: "수정 제안 (선택)" },
                },
              },
            },
          },
        },
      },
    ],
    // 반드시 tool을 사용하도록 강제
    tool_choice: { type: "tool", name: "submit_review" },
    messages: [{ role: "user", content: userContent }],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");
  if (!toolUse) {
    throw new Error("Claude가 tool을 사용하지 않음");
  }

  const { severity, summary, issues } = toolUse.input;

  // ─────────────────────────────────────────────
  // GitHub 리뷰 이벤트 결정
  //   CRITICAL → REQUEST_CHANGES (머지 차단)
  //   MINOR    → COMMENT (보류)
  //   APPROVED → APPROVE (즉시 머지)
  // ─────────────────────────────────────────────
  const githubEvent =
    severity === "CRITICAL"
      ? "REQUEST_CHANGES"
      : severity === "APPROVED"
      ? "APPROVE"
      : "COMMENT";

  // 심각도별 헤더
  const header =
    severity === "CRITICAL"
      ? "## 🚨 Claude 코드리뷰 — CRITICAL (머지 차단)"
      : severity === "APPROVED"
      ? "## ✅ Claude 코드리뷰 — 승인"
      : "## ⚠️ Claude 코드리뷰 — 개선 필요 (MINOR)";

  // MINOR일 경우 /merge 안내 추가
  const mergeGuide =
    severity === "MINOR"
      ? "\n> 이슈를 인지했다면 댓글에 `/merge`를 포함해서 머지할 수 있습니다.\n> 예: `이건 다음에 수정하겠습니다 /merge`\n"
      : "";

  // 이슈 목록 마크다운 생성
  const issueLines = issues
    .map((i) => {
      const icon =
        i.level === "CRITICAL" ? "🔴" : i.level === "WARNING" ? "🟡" : "🔵";
      const suggestion = i.suggestion
        ? `\n> 💡 ${i.suggestion}`
        : "";
      return `### ${icon} [${i.level}] \`${i.file}\`\n${i.description}${suggestion}`;
    })
    .join("\n\n");

  // 재리뷰인 경우 이전 이슈 반영 여부를 헤더에 표시
  const reviewTypeNote = isFirstReview
    ? ""
    : "\n> 🔄 _이전 리뷰 이후 변경사항 기준으로 재검토했습니다._\n";

  const body = [
    "<!-- claude-review -->",
    header,
    reviewTypeNote,
    summary,
    mergeGuide,
    issues.length > 0 ? "\n---\n\n" + issueLines : "",
    "\n---",
    "_이 리뷰는 Claude가 자동으로 작성했습니다._",
  ]
    .filter(Boolean)
    .join("\n");

  writeFileSync(
    "review-result.json",
    JSON.stringify({ severity, githubEvent, body }, null, 2)
  );
  console.log(`리뷰 완료: ${severity}`);
} catch (err) {
  // ─────────────────────────────────────────────
  // Claude API 에러 → 폴백
  //   429: 크레딧 소진 / Rate Limit
  //   400: 토큰 한도 초과
  //   529: 서버 과부하
  // ─────────────────────────────────────────────
  const status = err?.status ?? "unknown";
  console.error(`[코드리뷰] Claude API 오류 (HTTP ${status}): ${err.message}`);
  writeFileSync("review-result.json", JSON.stringify(buildSkippedResult(), null, 2));
  process.exit(0); // exit 0 → 워크플로우가 실패로 표시되지 않음
}
