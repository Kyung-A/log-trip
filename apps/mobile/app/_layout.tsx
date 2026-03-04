import {
  checkIfUserExists,
  setSupabaseCookie,
  supabase,
  TabBarProvider,
} from "@/shared";
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
  // * 세션 여부 검사
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const isUserExists = await checkIfUserExists(session.user.id);

          if (isUserExists) {
            await setSupabaseCookie(session);

            router.replace({
              pathname: "/(tabs)",
            });
          } else {
            Toast.show({
              type: "error",
              text1: "회원가입을 완료해주세요.",
            });
            router.replace({
              pathname: "/(auth)/user-info",
              params: {
                session: JSON.stringify(session),
                platform: session.user.app_metadata.provider,
              },
            });
          }
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

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // 세션이 생기거나 갱신되면 쿠키 업데이트
        await setSupabaseCookie(session);
      } else if (event === "SIGNED_OUT") {
        // 로그아웃 시 웹뷰 쿠키도 삭제 로직이 필요하다면 여기서 수행
        // 예: await NitroCookies.remove(url, 'sb-xxx-auth-token');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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
        <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
        {/* <Stack.Screen name="createCompanion" options={{ headerShown: false }} /> // TODO: 추후 추가 예정 서비스 */}
      </Stack>
      <Toast config={toastConfig} topOffset={80} />
    </TabBarProvider>
  );
}
