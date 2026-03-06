import { LoadingView, supabase, useTabBarVisibility } from "@/shared";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useWebviewRefs } from "./_layout";

export default function MyPageScreen() {
  const { publicDiaryWebviewRef, diaryWebviewRef } = useWebviewRefs();
  const webViewRef = useRef<WebView>(null);
  const { setTabBarVisible } = useTabBarVisibility();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        ref={webViewRef}
        style={{ flex: 1 }}
        source={{
          uri: `${process.env.EXPO_PUBLIC_WEBVIEW_URL}/mypage`,
        }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
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

            if (data.type === "REFRESH_PUBLIC_DIARY_DATA") {
              publicDiaryWebviewRef?.current?.injectJavaScript(`
              if (window.forceRefreshMap) {
                window.forceRefreshMap();
              }
              true;
            `);
            }

            if (data.type === "REFRESH_DIARY_DATA") {
              diaryWebviewRef?.current?.injectJavaScript(`
                if (window.forceRefreshMap) {
                  window.forceRefreshMap();
                }
              true;
            `);
            }
          } catch (e) {
            console.warn("Invalid message from web", e);
          }
        }}
        allowsInlineMediaPlayback={true}
        allowFileAccess={true}
      />

      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
}
