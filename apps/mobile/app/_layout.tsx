import {
  checkIfUserExists,
  setSupabaseCookie,
  supabase,
  TabBarProvider,
  toastConfig,
  WebviewProvider,
} from "@/shared";
import { router, SplashScreen, Stack } from "expo-router";
import Toast from "react-native-toast-message";
import "react-native-reanimated";
import { useEffect } from "react";
import { AppState } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data: claims, error: userError } =
          await supabase.auth.getClaims();

        if (userError || !claims) {
          router.replace("/(auth)");
        } else {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          const isUserExists = await checkIfUserExists(session?.user.id);

          if (isUserExists && session) {
            await setSupabaseCookie(session);
            router.replace("/(tabs)");
          } else {
            router.replace("/(auth)/user-info");
          }
        }
      } catch (e) {
        await supabase.auth.signOut({ scope: "local" });
        router.replace("/(auth)");
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "TOKEN_REFRESHED") {
        await setSupabaseCookie(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // * 앱 상태 감지 로직 예시
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState === "active") {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session) {
            await setSupabaseCookie(session);
          }
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <WebviewProvider>
      <TabBarProvider>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="createDiary" options={{ headerShown: false }} />
          <Stack.Screen
            name="thirdPartyLoginResult"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
        </Stack>
        <Toast config={toastConfig} topOffset={80} />
      </TabBarProvider>
    </WebviewProvider>
  );
}
