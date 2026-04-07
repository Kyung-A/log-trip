import { useWebviewRefs, WebViewContainer } from "@/shared";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback } from "react";

export default function PublicDiaryScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<any>>();
  const { planWebviewRef } = useWebviewRefs();

  // useFocusEffect(
  //   useCallback(() => {
  //     const unsubscribe = navigation.addListener("tabPress", (e) => {
  //       if (navigation.isFocused() && planWebviewRef.current) {
  //         if ((planWebviewRef.current as any).startRefresh) {
  //           (planWebviewRef.current as any).startRefresh();
  //         }

  //         planWebviewRef.current.injectJavaScript(`
  //           if(window.forceRefreshList) window.forceRefreshList();
  //           true;
  //       `);
  //       }
  //     });
  //     return unsubscribe;
  //   }, [navigation, planWebviewRef]),
  // );

  return (
    <WebViewContainer
      ref={planWebviewRef}
      url={`${process.env.EXPO_PUBLIC_WEBVIEW_URL}/plan`}
    />
  );
}
