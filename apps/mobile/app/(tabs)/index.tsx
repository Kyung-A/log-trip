import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { ActivityIndicator } from "react-native";
import WebView from "react-native-webview";

export default function HomeScreen() {
  const webviewRef = useRef(null);
  const params = useLocalSearchParams();
  const { accessToken, refreshToken } = params;

  const injectSession = () => {
    if (webviewRef.current && accessToken && refreshToken) {
      const message = JSON.stringify({
        type: "SESSION",
        accessToken,
        refreshToken,
      });

      webviewRef.current.postMessage(message);
    }
  };

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: "http://localhost:3000/world-map" }}
      onLoadEnd={injectSession}
      style={{ flex: 1 }}
      renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
      startInLoadingState={true}
      webviewDebuggingEnabled={true}
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
    />
  );
}
