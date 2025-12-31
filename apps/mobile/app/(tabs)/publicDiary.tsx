import { useTabBarVisibility } from "@/shared";
import { useRef } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function PublicDiaryScreen() {
  const webViewRef = useRef<WebView>(null);
  const { setTabBarVisible } = useTabBarVisibility();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        ref={webViewRef}
        source={{ uri: "http://localhost:3000/public-diary" }}
        style={{ flex: 1 }}
        renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
        startInLoadingState={true}
        webviewDebuggingEnabled={true}
        pullToRefreshEnabled={true}
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
              webViewRef.current?.injectJavaScript(`
                  window.location.href = '/public-diary';
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
