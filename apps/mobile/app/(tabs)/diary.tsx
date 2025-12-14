import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function DiaryScreen() {
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
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        ref={webviewRef}
        onLoadEnd={injectSession}
        source={{ uri: "http://localhost:3000/diary" }}
        style={{ flex: 1 }}
        renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
        startInLoadingState={true}
        webviewDebuggingEnabled={true}
        pullToRefreshEnabled={true}
      />
    </SafeAreaView>
  );
}
