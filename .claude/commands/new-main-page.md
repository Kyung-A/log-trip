# /new-main-page

탭바 메인 메뉴 페이지를 생성합니다.
공유 패키지 없음. Web과 Mobile 각각 독립적으로 생성.

## 사용법

/new-main-page <기능명(영문camelCase)> <한글표시명> <아이콘명>
예시: /new-main-page products 상품 ShoppingBag

---

## STEP 1 — Web 페이지 생성 (Next.js App Router — apps/web 전용 규칙)

> **app/ 디렉토리 규칙:**
> - `page.tsx` / `layout.tsx` 파일만 존재. 컴포넌트 파일 금지.
> - 무조건 RSC. `"use client"` 금지.
> - Client Component는 `widgets/` 또는 `features/`에 생성 후 import.

아래 파일들을 FSD 레이어 순서대로 생성한다:

**1-1. Entity 레이어**

- `apps/web/entities/<기능명>/types.ts` — 도메인 타입
- `apps/web/entities/<기능명>/api/<함수명>.ts` — Supabase API 호출 ("use server")
- `apps/web/entities/<기능명>/index.ts` — 배럴 export

**1-2. Widget 또는 Feature 레이어 (Client Component)**

인터랙션이 필요하면 `widgets/<기능명>/ui/<Feature>Client.tsx` 생성 ("use client")

**1-3. Pages 레이어 (RSC만)**

```tsx
// apps/web/app/<기능명>/page.tsx
import { get<Feature>s } from "@/entities/<기능명>";
import { <Feature>Client } from "@/widgets/<기능명>";  // 필요한 경우

export default async function <Feature>Page() {
  const data = await get<Feature>s();
  return <<Feature>Client data={data} />;
}
```

### STEP 2 — Web 생성 검증 후 커밋

```bash
pnpm --filter=web lint
```

통과 시: `git add apps/web && git commit -m "feat(web): <기능명> 메인 페이지 생성"`

---

## STEP 3 — Mobile 탭 추가 (Expo React Native — apps/mobile 전용 규칙)

> **apps/mobile app/ 디렉토리 규칙:**
> - Expo Router 기반. RSC 개념 없음. 일반 React Native 컴포넌트.
> - 비즈니스 로직 금지. WebView 래퍼 역할만.

**3-1. 탭 페이지 생성**

```tsx
// apps/mobile/app/(tabs)/<기능명>.tsx
import { useWebviewRefs, WebViewContainer } from "@/shared";

export default function <Feature>Screen() {
  const { <기능명>WebviewRef } = useWebviewRefs();
  return (
    <WebViewContainer
      ref={<기능명>WebviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/<기능명>`}
    />
  );
}
```

**3-2. 탭바 레이아웃 등록**

`apps/mobile/app/(tabs)/_layout.tsx`에 TAB_ICONS 및 Tabs.Screen 추가:

```tsx
const TAB_ICONS: Record<string, any> = {
  // ...기존
  [파일명]: { Lib: [아이콘 라이브러리명], name: [아이콘 이름], size: 19 },
};

<Tabs.Screen name="[파일명]" options={{ title: "[표시명]" }} />;
```

### STEP 4 — Mobile 검증 후 커밋

```bash
pnpm --filter=mobile lint
```

통과 시: `git add apps/mobile && git commit -m "feat(mobile): <기능명> 탭 추가"`

### STEP 5 — 완료 리포트

생성된 파일 목록과 다음 작업 안내 출력.
