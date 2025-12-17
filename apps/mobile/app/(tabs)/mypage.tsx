import { router } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function MyPageScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        source={{ uri: "http://localhost:3000/my" }}
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
              const { path } = data.payload;

              router.push({
                pathname: path,
              });
            }
          } catch (e) {
            console.warn("Invalid message from web", e);
          }
        }}
      />
    </SafeAreaView>
  );
}
