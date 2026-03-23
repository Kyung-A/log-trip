import { useWebviewRefs, WebViewContainer } from "@/shared";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback } from "react";

export default function PublicDiaryScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const { publicDiaryWebviewRef } = useWebviewRefs();

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("tabPress", (e) => {
        if (navigation.isFocused() && publicDiaryWebviewRef.current) {
          if ((publicDiaryWebviewRef.current as any).startRefresh) {
            (publicDiaryWebviewRef.current as any).startRefresh();
          }

          publicDiaryWebviewRef.current.injectJavaScript(`
            if(window.forceRefreshList) window.forceRefreshList();
            true;
        `);
        }
      });
      return unsubscribe;
    }, [navigation, publicDiaryWebviewRef]),
  );

  return (
    <WebViewContainer
      ref={publicDiaryWebviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/public-diary`}
    />
  );
}
