import { useWebviewRefs, WebViewContainer } from "@/shared";

export default function HomeScreen() {
  const { mapWebviewRef } = useWebviewRefs();

  return (
    <WebViewContainer
      ref={mapWebviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/world-map`}
      showSafeArea={false}
    />
  );
}
