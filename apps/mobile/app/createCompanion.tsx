import { LoadingView } from "@/shared";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

// TODO: 추후 추가 예정 서비스
export default function CreateCompanion() {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        ref={webViewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEBVIEW_URL}/companion/new` }}
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
              // TODO: 추후 추가 기능
              // router.replace("/(tabs)/companion");
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
