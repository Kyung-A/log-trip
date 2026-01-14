import { supabase, TabBarProvider } from "@/shared";
import { router, SplashScreen, Stack } from "expo-router";
import Toast, {
  BaseToastProps,
  ErrorToast,
  SuccessToast,
} from "react-native-toast-message";
import "react-native-reanimated";
import { useEffect } from "react";

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
        fontSize: 18,
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
        fontSize: 18,
        fontWeight: 600,
        textAlign: "center",
      }}
    />
  ),
};

export default function RootLayout() {
  useEffect(() => {
    const bootstrap = async () => {
      try {
        // TODO: 세션이 있어도 users 테이블에 유저가 없다면 로그인으로 이동
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch {
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
          }}
        />
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
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
