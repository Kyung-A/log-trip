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

export default function RootLayout() {
  useEffect(() => {
    const bootstrap = async () => {
      // * 딥링크 감지
      const sub = Linking.addEventListener("url", async ({ url }) => {
        // TODO: 회원가입 성공시 이메일 로그인 페이지로 리다이랙트
        if (url.includes("access_token") && url.includes("type=signup")) {
          router.replace("/(auth)/login");
          setTimeout(() => {
            Toast.show({
              type: "success",
              text1: "회원가입이 완료되었습니다. 로그인 해주세요.",
            });
          }, 500);
          await SplashScreen.hideAsync();
        } else {
          router.replace("/(auth)/login");
          setTimeout(() => {
            Toast.show({
              type: "error",
              text1: "회원가입에 실패했습니다. 다시 시도해주세요.",
            });
          }, 500);
          await SplashScreen.hideAsync();
        }
      });

      await new Promise((res) => setTimeout(res, 300));

      // * 세션 여부 검사
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch (e) {
        router.replace("/(auth)/login");
      } finally {
        await SplashScreen.hideAsync();
      }

      return () => sub.remove();
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
