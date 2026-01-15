import { supabase, TabBarProvider } from "@/shared";
import { router, SplashScreen, Stack } from "expo-router";
import Toast, {
  BaseToastProps,
  ErrorToast,
  SuccessToast,
} from "react-native-toast-message";
import "react-native-reanimated";
import { useEffect } from "react";
import * as Linking from "expo-linking";

export const unstable_settings = {
  initialRouteName: "(auth)/login",
};

SplashScreen.preventAutoHideAsync();

const toastConfig = {
  error: (props: BaseToastProps) => (
    <ErrorToast
      {...props}
      contentContainerStyle={{
        paddingHorizontal: 12,
        height: 50,
      }}
      style={{
        height: 50,
        backgroundColor: "#ecc8c4",
        borderLeftColor: "transparent",
        borderRadius: 999,
      }}
      text1Style={{
        color: "#a43336",
        fontSize: 16,
        fontWeight: 600,
        textAlign: "center",
      }}
    />
  ),
  success: (props: BaseToastProps) => (
    <SuccessToast
      {...props}
      contentContainerStyle={{ paddingHorizontal: 12, height: 50 }}
      style={{
        height: 50,
        backgroundColor: "#def3d6",
        borderLeftColor: "transparent",
        borderRadius: 999,
      }}
      text1Style={{
        color: "#596e50",
        fontSize: 16,
        fontWeight: 600,
        textAlign: "center",
      }}
    />
  ),
};

function parseAuthParams(url: string) {
  const fragment = url.split("#")[1];
  if (!fragment) return {};

  return Object.fromEntries(
    fragment.split("&").map((param) => {
      const [key, value] = param.split("=");
      return [key, decodeURIComponent(value)];
    })
  );
}

function useSupabaseEmailLinking() {
  useEffect(() => {
    const sub = Linking.addEventListener("url", async ({ url }) => {
      if (url.includes("access_denied")) {
        router.replace("/(auth)/login");
        setTimeout(() => {
          Toast.show({
            type: "error",
            text1: "잘못된 접근 및 링크가 만료 되었습니다.",
          });
        }, 300);
        return;
      }

      if (url.includes("access_token") && url.includes("type=signup")) {
        const params = parseAuthParams(url);

        const accessToken = params?.access_token;
        const refreshToken = params?.refresh_token;
        if (!accessToken || !refreshToken) return;

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("setSession error:", error.message);
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email_confirmed_at) {
          router.replace("/(auth)/email-login");
          setTimeout(() => {
            Toast.show({
              type: "success",
              text1: "회원가입이 완료되었습니다. 로그인 해주세요.",
            });
          }, 300);
        }
      }
    });

    return () => sub.remove();
  }, []);
}

export default function RootLayout() {
  useSupabaseEmailLinking();

  // * 세션 여부 검사
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          router.replace({
            pathname: "/(tabs)",
            params: {
              accessToken: session.access_token,
              refreshToken: session.refresh_token,
            },
          });
        } else {
          router.replace("/(auth)/login");
        }
      } catch (e) {
        router.replace("/(auth)/login");
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    bootstrap();
  }, []);

  return (
    <TabBarProvider>
      <Stack>
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
        {/* <Stack.Screen name="createCompanion" options={{ headerShown: false }} /> // TODO: 추후 추가 예정 서비스 */}
      </Stack>
      <Toast config={toastConfig} topOffset={80} />
    </TabBarProvider>
  );
}
