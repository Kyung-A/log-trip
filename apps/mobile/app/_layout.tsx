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
import { useEffect, useState } from "react";
import NitroCookies from "react-native-nitro-cookies";
import { AppState } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  // * 세션 여부 검사
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          setInitialRoute("(auth)/login");
          return;
        }

        const isUserExists = await checkIfUserExists(session.user.id);

        if (isUserExists) {
          await setSupabaseCookie(session);
          await new Promise((resolve) => setTimeout(resolve, 300));
          setInitialRoute("(tabs)");
        } else {
          setInitialRoute("/(auth)/user-info");
        }
      } catch (e) {
        await supabase.auth.signOut();
        setInitialRoute("(auth)/login");
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        await setSupabaseCookie(session);
      } else if (event === "SIGNED_OUT") {
        const domain = process.env.EXPO_PUBLIC_WEBVIEW_URL as string;
        const projectId = process.env.EXPO_PUBLIC_SUPABASE_ID as string;
        const cookieName = `sb-${projectId}-auth-token`;

        try {
          await NitroCookies.clearByName(domain, cookieName);
        } catch (e) {
          console.error("쿠키 삭제 실패:", e);
        }

        router.replace("/(auth)/login");
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

  if (!isReady) return null;

  return (
    <WebviewProvider>
      <TabBarProvider>
        <Stack initialRouteName={initialRoute as any}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
          <Stack.Screen
            name="(auth)/email-login"
            options={{
              title: "로그인",
              headerBackTitle: "뒤로",
            }}
          />
          <Stack.Screen
            name="(auth)/email-signup"
            options={{
              title: "회원가입",
              headerBackTitle: "뒤로",
            }}
          />
          <Stack.Screen
            name="(auth)/user-info"
            options={{
              title: "프로필 입력",
              headerBackTitle: "",
              headerLeft: () => null,
              headerBackVisible: false,
            }}
          />
          <Stack.Screen name="createDiary" options={{ headerShown: false }} />
          <Stack.Screen
            name="thirdPartyLoginResult"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
          {/* <Stack.Screen name="createCompanion" options={{ headerShown: false }} /> // TODO: 추후 추가 예정 서비스 */}
        </Stack>
        <Toast config={toastConfig} topOffset={80} />
      </TabBarProvider>
    </WebviewProvider>
  );
}
