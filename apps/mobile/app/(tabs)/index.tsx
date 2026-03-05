import { LoadingView, supabase } from "@/shared";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, View } from "react-native";
import WebView from "react-native-webview";
import { useWebviewRefs } from "./_layout";

export default function HomeScreen() {
  const { mapWebviewRef } = useWebviewRefs();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={mapWebviewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEBVIEW_URL}/world-map` }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        style={{ flex: 1 }}
        webviewDebuggingEnabled={true}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === "LOGOUT_REQUIRED") {
            supabase.auth.signOut();
            router.replace("/(auth)/login");
            Alert.alert(
              "로그인 만료",
              "다시 로그인 해주세요.\n해당 문제가 계속 발생한다면,\n앱스토어로 문의 바랍니다.",
            );
          }
        }}
      />

      {isLoading && <LoadingView />}
    </View>
  );
}
