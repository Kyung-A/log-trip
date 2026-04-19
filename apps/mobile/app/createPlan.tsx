import { WebViewContainer } from "@/shared";
import { useRef } from "react";
import WebView from "react-native-webview";

export default function CreatePlan() {
  const webviewRef = useRef<WebView>(null);
  return (
    <WebViewContainer
      ref={webviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/plan/new`}
    />
  );
}
