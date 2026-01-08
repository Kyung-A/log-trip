import { useEffect } from "react";
import {
  useRouter,
  useGlobalSearchParams,
  useRootNavigationState,
  Stack,
} from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function NaverCallbackHandler() {
  const router = useRouter();
  const params = useGlobalSearchParams();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    const handleRedirect = () => {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(auth)/login");
      }
    };

    const timer = setTimeout(handleRedirect, 0);
    return () => clearTimeout(timer);
  }, [params, router, rootNavigationState?.key]);

  return (
    <>
      <Stack.Screen
        options={{
          animation: "none",
          presentation: "transparentModal",
          headerShown: false,
        }}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#d5b2a7" />
      </View>
    </>
  );
}
