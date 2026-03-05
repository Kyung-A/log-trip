import { LoadingView } from "@/shared";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { useWebviewRefs } from "./(tabs)/_layout";

export default function CreateDiary() {
  const { mapWebviewRef } = useWebviewRefs();
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        source={{ uri: `${process.env.EXPO_PUBLIC_WEBVIEW_URL}/diary/new` }}
        style={{ flex: 1 }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        webviewDebuggingEnabled={true}
        pullToRefreshEnabled={true}
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

            if (data.type === "NAVIGATE") {
              const { path } = data.payload;

              router.push({
                pathname: path,
              });
            }

            if (data.type === "REFRESH_MAP_DATA") {
              mapWebviewRef?.current?.injectJavaScript(`
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
