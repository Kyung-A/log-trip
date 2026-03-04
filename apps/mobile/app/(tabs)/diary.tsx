import { LoadingView } from "@/shared";
import { useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function DiaryScreen() {
  const webviewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <WebView
        ref={webviewRef}
        source={{ uri: `${process.env.EXPO_PUBLIC_WEBVIEW_URL}/diary` }}
        style={{ flex: 1 }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        webviewDebuggingEnabled={true}
        pullToRefreshEnabled={true}
        allowsInlineMediaPlayback={true}
        allowFileAccess={true}
        sharedCookiesEnabled={true}
        thirdPartyCookiesEnabled={true}
      />

      {isLoading && <LoadingView />}
    </SafeAreaView>
  );
}
