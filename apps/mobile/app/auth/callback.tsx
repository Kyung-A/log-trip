import { useEffect } from "react";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { resendEmail, supabase } from "@/shared";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthCallback() {
  const params = useLocalSearchParams();
  const { email } = params;

  const parseAuthParams = (url: string) => {
    const fragment = url.split("#")[1];
    if (!fragment) return {};

    return Object.fromEntries(
      fragment.split("&").map((param) => {
        const [key, value] = param.split("=");
        return [key, decodeURIComponent(value)];
      }),
    );
  };

  const setSession = async (accessToken: string, refreshToken: string) => {
    if (!accessToken || !refreshToken) return;

    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      console.error("setSession error:", error.message);
      return;
    }

    router.replace("/(auth)/email-login");
    setTimeout(() => {
      Toast.show({
        type: "success",
        text1: "회원가입이 완료되었습니다. 로그인 해주세요.",
      });
    }, 300);
  };

  useEffect(() => {
    const handleUrl = (url: string | null) => {
      if (!url) return;

      if (url.includes("access_denied")) {
        router.replace("/(auth)/login");
        setTimeout(() => {
          Toast.show({
            type: "error",
            text1: "잘못된 접근 및 링크가 만료 되었습니다. 다시 시도해주세요.",
          });
        }, 300);
        return;
      }

      if (url.includes("access_token") && url.includes("type=signup")) {
        const params = parseAuthParams(url);
        const accessToken = params?.access_token;
        const refreshToken = params?.refresh_token;

        setSession(accessToken, refreshToken);
      }
    };

    // 앱이 꺼져있는 상태에서 URL을 통해 열렸을 때 (Initial URL)
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url);
      }
    });

    // 앱이 켜져있는 상태에서 새로운 URL이 들어올 때 (Event Listener)
    const sub = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    return () => {
      if (sub) sub.remove();
    };
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["top", "left", "right"]}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 24,
          backgroundColor: "#ffffff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 600 }}>
          {email} 계정으로 발송된
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 600 }}>
          Confirm Your Signup 메일을 확인해주세요.
        </Text>
        <Text style={{ marginTop: 10 }}>
          해당 메일의{" "}
          <Text style={{ fontWeight: 600, color: "#0063ff" }}>
            이메일 인증 확인 링크
          </Text>
          를 클릭해 회원가입을 완료해주세요.
        </Text>
        <Text>
          만약, 메일이 도착하지 않은 경우{" "}
          <Text style={{ fontWeight: 600, color: "#d8002f" }}>재발송 버튼</Text>
          을 클릭해주세요.
        </Text>
        <TouchableOpacity
          onPress={async () => {
            const { error } = await resendEmail(email as string);

            if (error) {
              const match = (error as unknown as string)?.match(/\d+/);

              Toast.show({
                type: "error",
                text1: `${match![0]}초 후 재시도 해주세요.`,
              });
            }
          }}
          style={{
            marginTop: 20,
            backgroundColor: "#e0e6ff",
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: "#03166c" }}>메일 재발송</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
