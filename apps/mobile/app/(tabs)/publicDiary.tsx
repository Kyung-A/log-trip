import { LoadingView, useTabBarVisibility } from "@/shared";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useWebviewRefs } from "./_layout";

export default function PublicDiaryScreen() {
  const { publicDiaryWebviewRef, diaryWebviewRef } = useWebviewRefs();
  const { setTabBarVisible } = useTabBarVisibility();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        ref={publicDiaryWebviewRef}
        style={{ flex: 1 }}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEBVIEW_URL}/public-diary` }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        webviewDebuggingEnabled={true}
        pullToRefreshEnabled={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
        onNavigationStateChange={(navState) => {
          const url = navState.url;
          const isMypage = /profile\/.+/.test(url);
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

            if (data.type === "WINDOW_LOCATION") {
              publicDiaryWebviewRef?.current?.injectJavaScript(`
                  window.location.href = '/public-diary';
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
      />

      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
}
