import { useWebviewRefs, WebViewContainer } from "@/shared";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback } from "react";

export default function DiaryScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const { diaryWebviewRef } = useWebviewRefs();

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("tabPress", (e) => {
        if (navigation.isFocused() && diaryWebviewRef.current) {
          if ((diaryWebviewRef.current as any).startRefresh) {
            (diaryWebviewRef.current as any).startRefresh();
          }

          diaryWebviewRef.current.injectJavaScript(`
              if(window.forceRefreshList) window.forceRefreshList();
              true;
          `);
        }
      });
      return unsubscribe;
    }, [navigation, diaryWebviewRef]),
  );

  return (
    <WebViewContainer
      ref={diaryWebviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/diary`}
    />
  );
}
