import { useWebviewRefs, WebViewContainer } from "@/shared";

export default function PublicDiaryScreen() {
  const { planWebviewRef } = useWebviewRefs();

  return (
    <WebViewContainer
      ref={planWebviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/plan`}
    />
  );
}
