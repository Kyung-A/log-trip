import { ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function TabTwoScreen() {
  return (
    <WebView
      source={{ uri: "http://localhost:3000" }}
      style={{ flex: 1 }}
      startInLoadingState={true}
      renderLoading={() => <ActivityIndicator style={{ marginTop: 20 }} />}
    />
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
