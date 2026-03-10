import { useWebviewRefs, WebViewContainer } from "@/shared";

export default function PublicDiaryScreen() {
  const { publicDiaryWebviewRef } = useWebviewRefs();

  return (
    <WebViewContainer
      ref={publicDiaryWebviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/public-diary`}
    />
  );
}
