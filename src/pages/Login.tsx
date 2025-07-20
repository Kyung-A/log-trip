import { Image, Linking, Pressable, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

export default function LoginScreen() {
  const signInWithKakao = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: process.env.EXPO_PUBLIC_KAKAO_CALLBACK_URL,
      },
    });

    if (error) {
      console.error("OAuth error:", error.message);
      return;
    }

    if (data?.url) {
      console.log("🔗 브라우저 열기:", data.url);
      await Linking.openURL(data.url);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log(data);
      if (data.session) {
        console.log("로그인 성공!", data.session);
      }
    };

    checkSession();
  }, []);

  return (
    <View className="items-center justify-center flex-1 bg-white">
      <View className="w-40 h-40">
        <Image
          source={require("../../assets/images/logo.png")}
          className="object-cover w-full h-full"
        />
      </View>
      <View className="mt-14">
        <Pressable
          onPress={signInWithKakao}
          className="px-4 py-3 rounded-full w-60 border border-[#a38f86]"
        >
          <Text className="font-bold text-center text-[#a38f86]">
            카카오 로그인
          </Text>
        </Pressable>
        <Pressable className="px-4 py-3 rounded-full w-60 border border-[#a38f86] mt-2">
          <Text className="font-bold text-center text-[#a38f86]">
            네이버 로그인
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
