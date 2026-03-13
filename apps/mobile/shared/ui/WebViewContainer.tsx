import {
  LoadingView,
  supabase,
  useTabBarVisibility,
  useWebviewRefs,
} from "@/shared";
import { router } from "expo-router";
import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { Alert } from "react-native";
import NitroCookies from "react-native-nitro-cookies";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView, WebViewProps } from "react-native-webview";

interface WebViewContainerProps extends WebViewProps {
  url: string;
  showSafeArea?: boolean;
}

const WebViewContainer = forwardRef(
  ({ url, showSafeArea = true, ...props }: WebViewContainerProps, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const internalWebViewRef = useRef<WebView>(null);
    const {
      mapWebviewRef,
      publicDiaryWebviewRef,
      mypageWebviewRef,
      diaryWebviewRef,
    } = useWebviewRefs();
    const { setTabBarVisible } = useTabBarVisibility();

    useImperativeHandle(ref, () => internalWebViewRef.current);

    const handleMessage = async (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        const { path } = data.payload || {};

        const domain = process.env.EXPO_PUBLIC_WEBVIEW_URL as string;
        const projectId = process.env.EXPO_PUBLIC_SUPABASE_ID as string;
        const cookieName = `sb-${projectId}-auth-token`;

        switch (data.type) {
          case "BACK":
            router.back();
            break;

          case "NAVIGATE":
            router.navigate(path);
            break;

          case "WINDOW_LOCATION":
            internalWebViewRef?.current?.injectJavaScript(`
                window.location.href = "${path}";
                true;
            `);
            break;

          case "LOGOUT":
            await supabase.auth.signOut();
            await NitroCookies.clearByName(domain, cookieName);
            router.replace("/(auth)/login");
            break;

          case "DELETE_USER":
            await supabase.auth.signOut();
            await NitroCookies.clearByName(domain, cookieName);
            router.replace("/(auth)/login");
            break;

          case "NOT_SESSION":
            await NitroCookies.clearByName(domain, cookieName);
            router.replace("/(auth)/login");
            break;

          case "REFRESH_MAP_DATA":
            mapWebviewRef?.current?.injectJavaScript(
              `if(window.forceRefreshMap) window.forceRefreshMap(); true;`,
            );
            break;

          case "REFRESH_PUBLIC_DIARY_DATA":
            publicDiaryWebviewRef?.current?.injectJavaScript(
              `if(window.forceRefreshMap) window.forceRefreshMap(); true;`,
            );
            break;

          case "REFRESH_MYPAGE_DATA":
            mypageWebviewRef?.current?.injectJavaScript(
              `if(window.forceRefreshMap) window.forceRefreshMap(); true;`,
            );
            break;

          case "REFRESH_DIARY_DATA":
            diaryWebviewRef?.current?.injectJavaScript(
              `if(window.forceRefreshMap) window.forceRefreshMap(); true;`,
            );
            break;

          default:
            props.onMessage?.(event);
        }
      } catch (e) {
        console.warn("Invalid message from web", e);
      }
    };

    const content = (
      <>
        <WebView
          ref={internalWebViewRef}
          source={{ uri: url }}
          style={{ flex: 1 }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          webviewDebuggingEnabled={true}
          pullToRefreshEnabled={true}
          allowsInlineMediaPlayback={true}
          allowFileAccess={true}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
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
          onNavigationStateChange={(navState) => {
            const url = navState.url;
            const hidden =
              /profile\/.+/.test(url) ||
              /mypage\/.+/.test(url) ||
              /companion\/.+/.test(url);
            setTabBarVisible(hidden ? false : true);
          }}
          onMessage={handleMessage}
          {...props}
        />
        {isLoading && <LoadingView />}
      </>
    );

    if (showSafeArea) {
      return (
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "#fff" }}
          edges={["top", "left", "right"]}
        >
          {content}
        </SafeAreaView>
      );
    }

    return content;
  },
);

WebViewContainer.displayName = "WebViewContainer";
export default WebViewContainer;
