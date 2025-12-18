import { useTabBarVisibility } from "@/shared";
import { useRef } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

export default function TabTwoScreen() {
  const webViewRef = useRef<WebView>(null);
  const { setTabBarVisible } = useTabBarVisibility();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        ref={webViewRef}
        source={{ uri: "http://localhost:3000/companion" }}
        style={{ flex: 1 }}
        renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
        onNavigationStateChange={(navState) => {
          const url = navState.url;
          const isCompanion = /companion\/.+/.test(url);
          setTabBarVisible(isCompanion ? false : true);
        }}
        startInLoadingState={true}
        webviewDebuggingEnabled={true}
        pullToRefreshEnabled={true}
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
            if (data.type === "WINDOW_LOCATION") {
              webViewRef.current?.injectJavaScript(`
                window.location.href = '/companion';
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
