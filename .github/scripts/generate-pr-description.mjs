/**
 * Claude를 이용해 PR 제목과 설명을 자동 생성하는 스크립트
 *
 * 입력: changes.diff (main 대비 현재 브랜치 전체 변경사항)
 * 출력: { title, body } JSON (stdout)
 *
 * 실행 환경변수:
 *   ANTHROPIC_API_KEY  - Claude API 키
 *   BRANCH_NAME        - 현재 브랜치명 (feat/diary-create 등)
 *   COMMIT_MESSAGES    - 커밋 메시지 목록 (폴백용, 개행 구분)
 *   CHANGED_FILES      - 변경된 파일 목록 (폴백용, 개행 구분)
 */

import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "fs";

const branchName = process.env.BRANCH_NAME || "unknown";
const commitMessages = process.env.COMMIT_MESSAGES || "";
const changedFiles = process.env.CHANGED_FILES || "";

// ─────────────────────────────────────────────
// 폴백: Claude 없이 커밋 메시지 + 파일 목록으로
//        최소한의 PR 설명을 생성하는 함수
// → API 키 없음 / 토큰 초과 / 크레딧 소진 등
//   어떤 이유로든 Claude 호출이 실패했을 때 사용
// ─────────────────────────────────────────────
function buildFallbackMeta() {
  // 브랜치명에서 prefix 추론: feat/xxx → feat
  const prefix = branchName.includes("/")
    ? branchName.split("/")[0]
    : "chore";

  // 커밋 메시지 중 첫 번째를 제목 후보로 사용
  const firstCommit = commitMessages.split("\n").find((l) => l.trim()) || "";
  const titleSuffix = firstCommit
    ? firstCommit.replace(/^[a-z]+:\s*/i, "").trim() // 기존 prefix 중복 제거
    : branchName.split("/").slice(1).join(" ").replace(/-/g, " ");

  const title = `${prefix}: ${titleSuffix}`;

  const filesSection = changedFiles
    ? changedFiles
        .split("\n")
        .filter(Boolean)
        .map((f) => `- \`${f}\``)
        .join("\n")
    : "_(파일 목록 없음)_";

  const commitsSection = commitMessages
    ? commitMessages
        .split("\n")
        .filter(Boolean)
        .map((c) => `- ${c}`)
        .join("\n")
    : "_(커밋 메시지 없음)_";

  const body = `## 작업 내용
> ⚠️ Claude API를 사용할 수 없어 커밋 메시지 기반으로 자동 생성되었습니다.

## 커밋 목록
${commitsSection}

## 변경된 파일
${filesSection}

## 체크리스트
- [ ] 테스트 완료
- [ ] 린트 통과
- [ ] 타입 오류 없음`;

  return { title, body };
}

// ─────────────────────────────────────────────
// API 키가 없으면 곧바로 폴백
// ─────────────────────────────────────────────
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("[PR 생성] ANTHROPIC_API_KEY 없음 → 폴백으로 PR 생성");
  console.log(JSON.stringify(buildFallbackMeta()));
  process.exit(0);
}

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// diff 파일 읽기
let diff;
try {
  diff = readFileSync("changes.diff", "utf-8").trim();
} catch {
  diff = "";
}

if (!diff) {
  console.log(JSON.stringify({
    title: `chore: ${branchName}`,
    body: "## 작업 내용\n변경사항이 없습니다.",
  }));
  process.exit(0);
}

// diff가 너무 길면 앞부분만 잘라서 전달
// 너무 크면 Claude API가 토큰 한도 초과 에러를 던지므로 미리 제한
const MAX_DIFF = 40_000;
const truncatedDiff =
  diff.length > MAX_DIFF
    ? diff.slice(0, MAX_DIFF) + "\n\n_(diff가 너무 길어 일부 생략됨)_"
    : diff;

// ─────────────────────────────────────────────
// Claude 호출 (실패 시 폴백으로 자동 전환)
// ─────────────────────────────────────────────
try {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    tools: [
      {
        name: "create_pr_meta",
        description: "PR 제목과 설명을 생성합니다",
        input_schema: {
          type: "object",
          required: ["title", "body"],
          properties: {
            title: {
              type: "string",
              description:
                "PR 제목. 'feat | fix | refactor | chore | docs: 한국어 요약' 형식으로 한 줄 작성.",
            },
            body: {
              type: "string",
              description: "PR 본문. 마크다운 형식의 작업 내용 설명.",
            },
          },
        },
      },
    ],
    // 반드시 tool을 사용하도록 강제 (텍스트 응답으로 인한 파싱 오류 방지)
    tool_choice: { type: "any" },
    messages: [
      {
        role: "user",
        content: `브랜치명: **${branchName}**

아래 git diff를 분석해서 GitHub PR의 제목과 본문을 **한국어**로 작성해주세요.

**제목 규칙:**
- 커밋 컨벤션 prefix 사용: feat / fix / refactor / chore / docs / style
  (브랜치명 또는 변경 성격에서 판단)
- 형식: "prefix: 변경 내용 요약"
- 변경 내용을 구체적으로 한 줄로 — 예) "feat: 다이어리 생성 폼 및 Supabase 저장 로직 추가"

**본문 형식 (마크다운, 다른 내용 없이 이것만):**

## 작업 내용
(핵심 변경 목적을 1~2줄로)

## 주요 변경 사항
- (변경 항목을 파일/기능 단위로)

## 체크리스트
- [ ] 테스트 완료
- [ ] 린트 통과
- [ ] 타입 오류 없음

---
git diff:
\`\`\`diff
${truncatedDiff}
\`\`\``,
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use");

  if (!toolUse) {
    // tool 호출 없이 텍스트로만 응답한 경우 → 폴백
    console.error("[PR 생성] Claude가 tool을 사용하지 않음 → 폴백");
    console.log(JSON.stringify(buildFallbackMeta()));
    process.exit(0);
  }

  console.log(JSON.stringify(toolUse.input));
} catch (err) {
  // ─────────────────────────────────────────────
  // Claude API 에러 → 폴백으로 PR 생성
  //
  // 주요 에러 케이스:
  //   - 429 (Too Many Requests): API 크레딧 소진 또는 Rate Limit
  //   - 400 (Bad Request): 토큰 한도 초과 (max_tokens 설정 문제)
  //   - 529 (Overloaded): Claude 서버 과부하
  //   - 네트워크 오류
  // ─────────────────────────────────────────────
  const status = err?.status ?? err?.statusCode ?? "unknown";
  console.error(`[PR 생성] Claude API 오류 (HTTP ${status}): ${err.message}`);
  console.error("→ 폴백으로 커밋 메시지 기반 PR 생성");

  console.log(JSON.stringify(buildFallbackMeta()));
  process.exit(0); // 에러가 있어도 exit 0 → 워크플로우가 실패로 표시되지 않음
}
