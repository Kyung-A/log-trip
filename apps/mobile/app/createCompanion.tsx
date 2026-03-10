import { WebViewContainer } from "@/shared";
import { useRef } from "react";
import WebView from "react-native-webview";

// TODO: 추후 추가 예정 서비스
export default function CreateCompanion() {
  const webViewRef = useRef<WebView>(null);

  return (
    <WebViewContainer
      ref={webViewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/companion/new`}
    />
  );
}
