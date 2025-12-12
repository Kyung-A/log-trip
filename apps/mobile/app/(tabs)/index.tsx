import { useRef } from "react";
import { ActivityIndicator } from "react-native";
import WebView from "react-native-webview";

export default function HomeScreen() {
  const webviewRef = useRef(null);

  return (
    <WebView
      ref={webviewRef}
      source={{ uri: "http://localhost:3000/world-map" }}
      style={{ flex: 1 }}
      renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
      startInLoadingState={true}
      webviewDebuggingEnabled={true}
    />
  );
}
