# /new-feature

CRUD 기능을 하나씩 추가합니다.
각 기능은 독립적으로 테스트-린트-커밋 사이클을 거칩니다.

## 사용법

/new-feature <기능명> <액션: create|read|update|delete|list>
예시: /new-feature products create

## 실행 규칙

- 한 번 호출 = 액션 하나만 처리
- 각 액션은 완전히 독립적인 커밋
- 여러 액션이 필요하면 /new-feature를 여러 번 호출

## features vs widgets 판단 (실행 전 반드시 확인)

| 조건 | 위치 |
|---|---|
| UI가 entities, shared만 import | `features/` |
| 다른 feature 컴포넌트/로직을 import | `widgets/` |

**feature → feature import는 FSD 위반.** 다른 feature의 컴포넌트를 재사용해야 한다면 해당 UI를 `widgets/`에 생성한다.

## 모든 Form은 react-hook-form 사용 (필수)

## 실행 순서

### STEP 1 — Supabase API 레이어

`apps/web/entities/<기능명>/api/` 내에 작성:

**list/read:**

```ts
"use server";

import { createServerClient } from "@/shared/lib/supabase";

import { I<Feature> } from "../types";

export const get<Feature>List = async (): Promise<I<Feature>[]> => { ... }
export const get<Feature>ById = async (id: string): Promise<I<Feature> | null> => { ... }
```

**create/update/delete (features 레이어 server action):**
`apps/web/features/<액션>-<기능명>/model/<액션><Feature>Action.ts`

```ts
"use server";

import { create<Feature> } from "@/entities/<기능명>";

export const create<Feature>Action = async (data: ...) => { ... }
```

### import 순서 규칙 (ESLint 강제)

```ts
import { external } from "library";   // external — 1그룹

import { Type } from "@/entities/..."; // internal (@/entities) — 2그룹

import { util } from "@/features/..."; // internal (@/features) — 3그룹 (있을 경우)

import { util } from "@/shared/...";   // internal (@/shared) — 4그룹

import { fn } from "../model";         // parent/sibling — 5그룹 (blank line 없이 묶음)
import { Comp } from "./Component";
```

**규칙**: `@/entities`, `@/features`, `@/shared`는 각각 blank line으로 구분. `../` 와 `./` 상대경로는 하나의 그룹(blank line 없이).

### STEP 2 — API 테스트 작성 및 실행

```bash
cd apps/web
pnpm --filter=web lint
```

### STEP 3 — UI 컴포넌트

- list → `entities/<기능명>/ui/<Feature>List.tsx`
- read → `entities/<기능명>/ui/<Feature>Detail.tsx`
- create/update → `features/<액션>-<기능명>/ui/<Feature>Form.tsx`
- delete → `features/delete-<기능명>/ui/Delete<Feature>Button.tsx`

### STEP 4 — 배럴 업데이트

해당 슬라이스의 index.ts에 새 export 추가

### STEP 5 — 린트

```bash
pnpm --filter=web lint
```

통과 시에만 커밋 진행.
실패 시 문제 해결 후 재시도.

### STEP 6 — 커밋

```bash
git add apps/web/entities/<기능명> apps/web/features/<액션>-<기능명>
git commit -m "feat(<기능명>): <액션> 기능 구현"
```

### STEP 7 — 완료 보고

- 생성된 파일 목록
- 배럴 export 반영 여부
- 다음 추천 액션 (ex: create 완료 → list 추가 추천)
