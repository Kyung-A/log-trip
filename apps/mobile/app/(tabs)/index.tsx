import { supabase } from "@/shared";
import { router, useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { ActivityIndicator } from "react-native";
import WebView from "react-native-webview";

export default function HomeScreen() {
  const webviewRef = useRef<WebView>(null);
  const params = useLocalSearchParams();
  const { accessToken, refreshToken } = params;

  const injectSession = () => {
    if (webviewRef.current && accessToken && refreshToken) {
      const message = JSON.stringify({
        type: "SESSION",
        accessToken,
        refreshToken,
      });

      webviewRef.current.postMessage(message);
    }
  };

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: `${process.env.EXPO_PUBLIC_WEBVIEW_URL}/world-map` }}
      onLoadEnd={() => {
        setTimeout(injectSession, 0);
      }}
      style={{ flex: 1 }}
      renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
      startInLoadingState={true}
      webviewDebuggingEnabled={true}
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "LOGOUT_REQUIRED") {
          supabase.auth.signOut();
          router.replace("/(auth)/login");
          alert(
            "다시 로그인 해주세요.\n해당 문제가 계속 발생한다면,\n앱스토어로 문의 바랍니다."
          );
        }
      }}
    />
  );
}
