### Feature-Sliced Design (FSD)

FSD 기반 레이어 구조를 따르며, ESLint import 규칙으로 강제됩니다.

root/
├── app/                  # Next.js 라우팅만 (RSC, 비즈니스 로직 금지)
│   └── [route]/
│       └── page.tsx
├── widgets/              # 여러 feature/entity를 조합한 UI 블록 (페이지 섹션 단위)
│   └── [feature]/
│       ├── ui/
│       └── index.ts
├── features/             # 단일 사용자 액션 (create, update, delete, login 등)
│   └── [action-name]/
│       ├── ui/           # 해당 액션의 form/button UI
│       ├── model/        # server action, 훅
│       └── index.ts
├── entities/             # 도메인 모델 및 데이터 표시 UI
│   └── [entity]/
│       ├── ui/           # 데이터 표시 전용 (action 없음)
│       ├── model/
│       ├── api/
│       ├── types.ts
│       └── index.ts
└── shared/               # 도메인 무관 공통 유틸리티
    ├── lib/
    ├── api/
    ├── hooks/
    ├── ui/
    ├── util/
    └── consts

## import 방향 (단방향 엄수)

`app → widgets → features → entities → shared`

**같은 레이어 간 import 금지** — 특히 feature → feature import는 절대 금지.

### features vs widgets 판단 기준

| 상황 | 위치 |
|---|---|
| 단일 액션 form/button, entities/shared만 import | `features/` |
| 다른 feature의 컴포넌트나 로직을 import | `widgets/` |
| 여러 feature를 조합한 페이지 섹션 | `widgets/` |

**예시:**
- `features/plan-create/` — 지역 선택 + 날짜 선택 form (entities만 import) ✓
- `features/plan-delete/` — 삭제 버튼 (entities만 import) ✓
- `widgets/plan-edit/` — plan-create의 CitySelectList + PlanStep2 재사용 → features 간 조합이므로 widgets ✓

## app/의 page.tsx 작성 방법

- RSC로 작성. 비즈니스 로직 직접 작성 금지.
- 데이터 fetch → Client Component에 props로 전달.

```tsx
// app/plan/[id]/page.tsx
import { PlanDetailClient } from "@/widgets/plan-detail";

export default async function PlanDetailPage({ params }) {
  const { id } = await params;
  const plan = await getPlan(id);
  return <PlanDetailClient plan={plan} />;
}
```

## 모든 Form은 react-hook-form 사용

```tsx
const { register, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
  defaultValues: { ... }
});
```

## 린트

```bash
pnpm --filter=web lint
```
