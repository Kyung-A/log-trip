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
