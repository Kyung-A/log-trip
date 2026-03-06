import { LoadingView } from "@/shared";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useWebviewRefs } from "./_layout";

export default function DiaryScreen() {
  const {
    mapWebviewRef,
    publicDiaryWebviewRef,
    diaryWebviewRef,
    mypageWebviewRef,
  } = useWebviewRefs();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        ref={diaryWebviewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEBVIEW_URL}/diary` }}
        style={{ flex: 1 }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        webviewDebuggingEnabled={true}
        pullToRefreshEnabled={true}
        allowsInlineMediaPlayback={true}
        allowFileAccess={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
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
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === "REFRESH_MAP_DATA") {
              mapWebviewRef?.current?.injectJavaScript(`
              if (window.forceRefreshMap) {
                window.forceRefreshMap();
              }
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

            if (data.type === "REFRESH_MYPAGE_DATA") {
              mypageWebviewRef?.current?.injectJavaScript(`
              if (window.forceRefreshMap) {
                window.forceRefreshMap();
              }
              true;
            `);
            }
          } catch (e) {
            console.error(e);
          }
        }}
      />

      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
}
