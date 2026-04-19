# /new-page

서브 페이지(생성/수정/상세 등)를 생성합니다.
메인 탭이 아닌 플로우 내 페이지.

## 사용법

/new-page <기능명> <페이지타입: create|edit|detail|list> [부모기능명]
예시: /new-page products create
예시: /new-page products detail products

## 페이지타입별 라우팅

| 타입   | Web 경로          | Mobile 경로              |
| ------ | ----------------- | ------------------------ |
| create | /[기능명]/new     | app/create[기능명].tsx   |
| detail | /[기능명]/[id]    | app/[기능명]/[id].tsx    |
| edit   | /[기능명]/[id]/edit | —                      |
| list   | /[기능명]         | app/(tabs)/[기능명].tsx  |

---

## STEP 1 — Web 페이지 생성 (Next.js App Router 규칙)

> **apps/web `app/` 디렉토리 규칙:**
> - `page.tsx` / `layout.tsx` 파일만 존재. 컴포넌트 파일 금지.
> - 무조건 RSC (Server Component). `"use client"` 금지.
> - Client Component는 `widgets/` 또는 `features/`에 생성 후 import.

**1-1. FSD 레이어 생성 (페이지타입에 맞는 액션)**

- create → `features/<기능명>-create/`
- edit   → `features/<기능명>-update/`
- 여러 feature 조합(상세 등) → `widgets/<기능명>-detail/ui/<Feature>Client.tsx`

features vs widgets 기준:
- entities/shared만 import → `features/`
- 다른 feature import 필요 → `widgets/`

**1-2. App Router page.tsx 작성**

```tsx
// apps/web/app/<기능명>/page.tsx  ← RSC
import { get<Feature>s } from "@/entities/<기능명>";
import { <Feature>Client } from "@/widgets/<기능명>-list"; // or features

export default async function <Feature>Page() {
  const data = await get<Feature>s();
  return <<Feature>Client data={data} />;
}
```

### STEP 2 — 검증 및 커밋

```bash
pnpm --filter=web lint
```

`git commit -m "feat(web): <기능명> <타입> 페이지"`

---

## STEP 3 — Mobile 페이지 생성 (Expo React Native 규칙)

> **apps/mobile `app/` 디렉토리 규칙:**
> - Expo Router 기반. RSC 개념 없음. 일반 React Native 컴포넌트.
> - 비즈니스 로직 금지. WebView 래퍼 역할만.
> - `shared/ui/WebViewContainer`를 사용해 web URL을 띄운다.

```tsx
// apps/mobile/app/create<Feature>.tsx
import { useRef } from "react";
import WebView from "react-native-webview";
import { WebViewContainer } from "@/shared";

export default function Create<Feature>Page() {
  const ref = useRef<WebView>(null);
  return (
    <WebViewContainer
      ref={ref}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/<기능명>/new`}
    />
  );
}
```

### STEP 4 — Mobile 커밋

`git commit -m "feat(mobile): <기능명> <타입> 페이지 연결"`
