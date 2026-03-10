import { useWebviewRefs, WebViewContainer } from "@/shared";

export default function MyPageScreen() {
  const { mypageWebviewRef } = useWebviewRefs();

  return (
    <WebViewContainer
      ref={mypageWebviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/mypage`}
    />
  );
}
