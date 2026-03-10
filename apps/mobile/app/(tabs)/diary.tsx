import { useWebviewRefs, WebViewContainer } from "@/shared";

export default function DiaryScreen() {
  const { diaryWebviewRef } = useWebviewRefs();

  return (
    <WebViewContainer
      ref={diaryWebviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/diary`}
    />
  );
}
