import { ActivityIndicator } from "react-native";
import WebView from "react-native-webview";

export default function HomeScreen() {
  return (
    <WebView
      source={{ uri: "http://localhost:3000/world-map" }}
      style={{ flex: 1 }}
      startInLoadingState={true}
      renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
    />
  );
}
