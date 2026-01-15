import { supabase, useTabBarVisibility } from "@/shared";
import { router } from "expo-router";
import { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function MyPageScreen() {
  const webViewRef = useRef<WebView>(null);
  const { setTabBarVisible } = useTabBarVisibility();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        ref={webViewRef}
        source={{
          uri: `${process.env.EXPO_PUBLIC_WEBVIEW_URL}/mypage`,
        }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        webviewDebuggingEnabled={true}
        pullToRefreshEnabled={true}
        onNavigationStateChange={(navState) => {
          const url = navState.url;
          const isMypage = /mypage\/.+/.test(url);
          setTabBarVisible(isMypage ? false : true);
        }}
        injectedJavaScriptBeforeContentLoaded={`
          (function () {
            window.ReactNativeWebView = window.ReactNativeWebView || {
              postMessage: function (data) {
                window.postMessage(data);
              }
            };
          })();
          true;
        `}
        onMessage={async (event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === "LOGOUT" || data.type === "DELETE-USER") {
              await supabase.auth.signOut();
              router.replace("/(auth)/login");
            }

            if (data.type === "NAVIGATE") {
              const { path } = data.payload;

              router.push({
                pathname: path,
              });
            }

            if (data.type === "WINDOW_LOCATION") {
              webViewRef.current?.injectJavaScript(`
                window.location.href = '/mypage';
                true;
              `);
            }
          } catch (e) {
            console.warn("Invalid message from web", e);
          }
        }}
      />
    </SafeAreaView>
  );
}
