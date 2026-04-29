코드리뷰가 누락된 PR을 찾아 사용자가 선택한 PR을 리뷰합니다.

## 실행 순서

### 1단계: 코드리뷰 누락 PR 조회

아래 명령어로 열린 PR 목록을 가져온다.

```bash
gh pr list --state open --json number,title,headRefName,createdAt
```

각 PR에 대해 Claude가 작성한 리뷰가 있는지 확인한다.
Claude 리뷰는 본문에 `<!-- claude-review -->` 마커가 포함된 리뷰로 식별한다.

```bash
gh api repos/{owner}/{repo}/pulls/{PR_NUMBER}/reviews \
  --jq '[.[] | select(.body | contains("<!-- claude-review -->"))] | length'
```

`{owner}/{repo}`는 `gh repo view --json nameWithOwner -q .nameWithOwner`로 가져온다.

### 2단계: 결과 표시

코드리뷰가 없는 PR 목록을 번호와 함께 표시한다.

예시:
```
코드리뷰가 없는 PR 목록입니다.

1. #12 feat: 다이어리 생성 로직 추가  (feat/diary-create)
2. #15 fix: 로그인 오류 수정           (fix/login-bug)
3. #18 refactor: 지도 컴포넌트 분리   (refactor/world-map)

리뷰할 PR 번호를 선택해주세요. (1~3 또는 'all' 입력 시 전체 리뷰)
```

코드리뷰 누락 PR이 없으면 "모든 PR에 코드리뷰가 완료되어 있습니다." 라고 안내하고 종료한다.

### 3단계: 사용자 선택 대기

사용자가 번호를 입력하면 해당 PR의 diff를 가져온다.

```bash
gh pr diff {PR_NUMBER}
```

`all` 입력 시 목록 순서대로 전체 리뷰를 진행한다.

### 4단계: 코드리뷰 진행

이 프로젝트 정보를 바탕으로 코드리뷰를 진행한다.

**프로젝트 정보:**
- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Supabase (인증 + DB)
- Feature-Sliced Design (FSD) 아키텍처: app → widgets → features → entities → shared (단방향)
- 같은 레이어 간 import 금지 (feature → feature 절대 금지)

**리뷰 기준 및 심각도:**
- `CRITICAL`: 보안 취약점, 데이터 손실 위험, 서비스 중단 가능성, 심각한 로직 오류 → **머지 불가**
- `MINOR`: 성능 문제, 잠재적 버그, FSD 아키텍처 위반, 코드 품질 → **수정 권장, 머지 보류**
- `APPROVED`: 이슈 없음 → **머지 가능**

### 5단계: GitHub PR에 리뷰 댓글 작성

리뷰 결과를 아래 형식으로 PR에 댓글을 작성한다.

심각도별 명령어:
- CRITICAL → `gh pr review {PR_NUMBER} --request-changes --body "..."`
- MINOR    → `gh pr review {PR_NUMBER} --comment --body "..."`
- APPROVED → `gh pr review {PR_NUMBER} --approve --body "..."` 후 `gh pr merge {PR_NUMBER} --rebase --delete-branch --yes`

댓글 본문 형식:
```
<!-- claude-review -->
## 🤖 Claude 코드리뷰

{종합 평가 요약}

---

{이슈 목록 (있을 경우)}
### [CRITICAL|WARNING|SUGGESTION] `파일경로`
이슈 내용
> 💡 수정 제안 (있을 경우)

---
_이 리뷰는 Claude가 자동으로 작성했습니다._
```

### 6단계: 완료 보고

리뷰가 완료된 PR 번호와 심각도 결과를 사용자에게 보고한다.
APPROVED로 머지된 PR은 "머지 완료" 로 표시한다.
