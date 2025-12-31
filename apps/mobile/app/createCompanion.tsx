import { router } from "expo-router";
import { useRef } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

// TODO: 추후 추가 예정 서비스
export default function CreateCompanion() {
  const webViewRef = useRef<WebView>(null);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        ref={webViewRef}
        source={{ uri: "http://localhost:3000/companion/new" }}
        style={{ flex: 1 }}
        renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
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

            if (data.type === "NAVIGATE") {
              // TODO: 추후 추가 기능
              // router.replace("/(tabs)/companion");
            }
          } catch (e) {
            console.warn("Invalid message from web", e);
          }
        }}
      />
    </SafeAreaView>
  );
}
