import {
  LoadingView,
  supabase,
  useTabBarVisibility,
  useWebviewRefs,
} from "@/shared";
import { router } from "expo-router";
import { useState, forwardRef, useImperativeHandle, useRef } from "react";
import { RefreshControl, ScrollView } from "react-native";
import NitroCookies from "react-native-nitro-cookies";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { WebView, WebViewProps } from "react-native-webview";

interface WebViewContainerProps extends WebViewProps {
  url: string;
  showSafeArea?: boolean;
}

const WebViewContainer = forwardRef(
  ({ url, showSafeArea = true, ...props }: WebViewContainerProps, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const lastErrorTime = useRef<number>(0);
    const internalWebViewRef = useRef<WebView>(null);
    const {
      mapWebviewRef,
      publicDiaryWebviewRef,
      mypageWebviewRef,
      diaryWebviewRef,
    } = useWebviewRefs();
    const { setTabBarVisible } = useTabBarVisibility();

    useImperativeHandle(ref, () => ({
      injectJavaScript: (data: string) =>
        internalWebViewRef.current?.injectJavaScript(data),
      startRefresh: () => {
        setIsRefreshing(true);
      },
    }));

    const sendErrorToWeb = (message: string) => {
      const now = Date.now();
      if (now - lastErrorTime.current < 1000) return;
      lastErrorTime.current = now;

      const jsCode = `
        if (window.showWebAlert) {
          window.showWebAlert("${message}");
        }
        true;
      `;
      internalWebViewRef.current?.injectJavaScript(jsCode);
    };

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
            try {
              await supabase.auth.signOut();
              await NitroCookies.clearByName(domain, cookieName);
              router.replace("/(auth)/login");
            } catch (e) {
              sendErrorToWeb("다시 시도해주세요.");
            }
            break;

          case "DELETE_USER":
            try {
              await supabase.auth.signOut();
              await NitroCookies.clearByName(domain, cookieName);
              router.replace("/(auth)/login");
            } catch (e) {
              sendErrorToWeb("다시 시도해주세요.");
            }
            break;

          case "NOT_SESSION":
            await NitroCookies.clearByName(domain, cookieName);
            Toast.show({
              type: "error",
              text1: "다시 로그인해주세요.",
            });
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
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            tintColor="#d5b2a8"
            colors={["#d5b2a8"]}
            onRefresh={() => {
              setIsRefreshing(true);
              internalWebViewRef.current?.reload();
            }}
          />
        }
      >
        <WebView
          ref={internalWebViewRef}
          source={{ uri: url }}
          style={{ flex: 1 }}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => {
            setIsLoading(false);
            setIsRefreshing(false);
          }}
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
      </ScrollView>
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
