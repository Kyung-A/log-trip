import { Image, Platform, Pressable, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";
import { getUser, getUserProfile, signInSNS } from "@/apis";
import { type Provider } from "@supabase/supabase-js";

export default function LoginScreen({ navigation }) {
  const checkIfUserExists = useCallback(async () => {
    const user = await getUser();
    const data = await getUserProfile(user.id);

    return data ? true : false;
  }, []);

  const saveSession = useCallback(async (result, platform) => {
    const rawUrl = result.url.replace("#", "?");

    const parsedUrl = new URL(rawUrl);
    const accessToken = parsedUrl.searchParams.get("access_token");
    const refreshToken = parsedUrl.searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      const isUserExists = await checkIfUserExists();

      if (isUserExists) {
        navigation.navigate("Home");
      } else {
        navigation.navigate("PhoneAuth", {
          platform: platform,
        });
      }
    }
  }, []);

  const signInWithKakao = useCallback(async (platform: Provider) => {
    const { data, error } = await signInSNS(platform);

    if (error) {
      console.error("Kakao OAuth error:", error.message);
      return;
    }

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        process.env.KAKAO_CALLBACK_URL
      );

      if (result.type === "success" && result.url) {
        await saveSession(result, platform);
      }
    }
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
          onPress={() => signInWithKakao("kakao")}
          className="px-4 py-3 rounded-full w-60 border border-[#a38f86]"
        >
          <Text className="font-bold text-center text-[#a38f86]">
            카카오 로그인
          </Text>
        </Pressable>
        <Pressable
          // onPress={() => signInWithKakao("naver")}
          className="px-4 py-3 rounded-full w-60 border border-[#a38f86] mt-2"
        >
          <Text className="font-bold text-center text-[#a38f86]">
            네이버 로그인
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
