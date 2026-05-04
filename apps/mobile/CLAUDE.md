# Mobile App 규칙

## 핵심 원칙

모바일은 WebView 래퍼다. 비즈니스 로직 작성 금지.

## WebView 설정

- 베이스 URL: process.env.EXPO_PUBLIC_WEBVIEW_URL
- WebView 공통 컴포넌트: shared/\_ui/WebViewContainer.tsx
- WebView ref context: shared/contexts/WebviewContext.tsx

## 메인 탭 페이지 (앱/(tabs)/)

```tsx
// apps/mobile/app/(tabs)/products.tsx
import { useWebviewRefs, WebViewContainer } from "@/shared";
export default function ProductsScreen() {
  const { productsWebviewRef } = useWebviewRefs();

  return (
    <WebViewContainer
      ref={productsWebviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/products`}
    />
  );
}
```

## 서브 페이지 (apps/mobile/app/...)

```tsx
// apps/mobile/app/createProducts.tsx
import { WebViewContainer } from "@/shared";
import { useRef } from "react";
import WebView from "react-native-webview";

export default function ProductCreatePage() {
  const webviewRef = useRef<WebView>(null);

  return (
    <WebViewContainer
      ref={webviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/products/new`}
    />
  );
}
```

## 탭바 등록

탭 추가 시 app/(tabs)/\_layout.tsx의 Tabs.Screen에 반드시 추가:

```tsx
const TAB_ICONS: Record<string, any> = {
    ...
  [파일명]: { Lib: [아이콘 라이브러리명], name: [아이콘 이름], size: 19 },
};

<Tabs.Screen name="[파일명]" options={{ title: "[표시명]" }} />;
```

## 금지

- useState, useEffect 등 로직 작성 금지 (WebViewContainer props 제외)
- API 호출 금지
- 상태관리 라이브러리 사용 금지

## iOS 배포

`.github/workflows/mobile-deploy.yml`로 자동화. `apps/mobile/**` 변경이 main에 머지되면 자동 트리거 → version bump → EAS 빌드 → TestFlight 업로드까지 진행.

**App Store 심사 제출은 수동.** 자동화된 범위는 TestFlight까지.

### 자동 version bump 정책

가장 최근 push의 commit prefix 기반:
- `feat!:` 또는 본문 `BREAKING CHANGE:` → major (1.2.1 → 2.0.0)
- `feat:` → minor (1.2.1 → 1.3.0)
- 그 외 (`fix`, `chore`, `style`, `refactor`, `docs`) → patch (1.2.1 → 1.2.2)

bump 결과는 워크플로우가 main에 자동 commit (`[skip ci]` 포함)하므로 `app.config.js`의 `version` 필드는 손대지 말 것.

### 주의사항

- **commit 메시지에 `[skip ci]`, `[ci skip]` 등 절대 쓰지 말 것** — GitHub Actions가 워크플로우를 통째로 스킵함
- 새 `EXPO_PUBLIC_*` 환경변수 추가 시 `cd apps/mobile && eas env:create production`으로 EAS 서버에도 등록 필요. `.env.production`은 빌드 서버에 안 올라감
- EAS 명령은 항상 `cd apps/mobile`에서 실행. 루트에서 돌리면 빈 `app.json` stub이 생성됨
- `eas.json`에는 민감 정보 넣지 말 것 (ascAppId/appleTeamId 같은 공개 식별자만 OK). 실제 secret은 EAS Secrets 또는 GitHub Secrets에 보관
- App Store Connect에 이미 존재하는 version과 충돌 시 거부됨. 수동으로 base version을 안전한 값으로 한 번만 보정 후 push하면 그 다음부터 자동 bump가 이어감
