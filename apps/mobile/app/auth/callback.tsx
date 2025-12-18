import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function AuthCallback() {
  const router = useRouter();
  const url = Linking.useURL();

  useEffect(() => {
    if (!url) return;

    const { queryParams } = Linking.parse(url);

    if (queryParams?.type === "signup") {
      Toast.show({
        type: "success",
        text1: "회원가입이 완료되었습니다. 로그인 해주세요.",
      });
      router.replace("/(auth)/login");
    } else {
      Toast.show({
        type: "error",
        text1: "회원가입에 실패했습니다. 문의 바랍니다.",
      });
      router.replace("/(auth)/login");
    }
  }, [router, url]);

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
}
