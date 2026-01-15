import { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function DiaryScreen() {
  const webviewRef = useRef(null);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        ref={webviewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEBVIEW_URL}/diary` }}
        style={{ flex: 1 }}
        startInLoadingState={true}
        webviewDebuggingEnabled={true}
        pullToRefreshEnabled={true}
      />
    </SafeAreaView>
  );
}
