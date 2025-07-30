import { Image, Platform, Pressable, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect } from "react";
import { getUser, getUserProfile, signInSNS } from "@/apis";
import { type Provider } from "@supabase/supabase-js";
import NaverLogin from "@react-native-seoul/naver-login";

export default function LoginScreen({ navigation }) {
  const checkIfUserExists = useCallback(async (id) => {
    const data = await getUserProfile(id);

    return data ? true : false;
  }, []);

  const saveSession = useCallback(
    async (accessToken, refreshToken, platform: Provider | string) => {
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        const user = await getUser();
        const isUserExists = await checkIfUserExists(user.id);

        if (isUserExists) {
          navigation.navigate("Home");
        } else {
          navigation.navigate("PhoneAuth", {
            platform: platform,
          });
        }
      }
    },
    []
  );

  const signInWithKakao = useCallback(async (platform: Provider) => {
    const { data, error } = await signInSNS(platform);

    if (error) {
      console.error("Kakao OAuth error:", error.message);
      return;
    }

    if (data?.url) {
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        process.env.AUTH_CALLBACK_URL
      );

      if (result.type === "success" && result.url) {
        const rawUrl = result.url.replace("#", "?");

        const parsedUrl = new URL(rawUrl);
        const accessToken = parsedUrl.searchParams.get("access_token");
        const refreshToken = parsedUrl.searchParams.get("refresh_token");

        await saveSession(accessToken, refreshToken, platform);
      }
    }
  }, []);

  const signInWithNaver = useCallback(async () => {
    const { failureResponse, successResponse } = await NaverLogin.login();
    if (successResponse) {
      const { accessToken, refreshToken } = successResponse;

      const profileResult = await NaverLogin.getProfile(
        successResponse!.accessToken
      );

      const { data: UserData } = await supabase.auth.signInWithPassword({
        email: profileResult.response.email,
        password: `${process.env.NAVER_USER_PASSWORD}${profileResult.response.id}`,
      });

      if (UserData.user)
        return await saveSession(accessToken, refreshToken, "naver");

      const { error } = await supabase.auth.signUp({
        email: profileResult.response.email,
        password: `${process.env.NAVER_USER_PASSWORD}${profileResult.response.id}`,
        options: {
          data: {
            name: profileResult.response.name,
            email_verified: true,
            email: profileResult.response.email,
          },
        },
      });

      if (error) {
        console.error(error);
        return;
      }

      const { data, error: errors } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      console.log(accessToken, refreshToken);

      // navigation.navigate("PhoneAuth", {
      //   platform: "naver",
      // });
    } else {
      console.error(failureResponse);
    }
  }, []);

  useEffect(() => {
    NaverLogin.initialize({
      appName: "로그트립",
      consumerKey: process.env.NAVER_CLIENT_ID,
      consumerSecret: process.env.NAVER_CLIENT_SECRET,
      serviceUrlSchemeIOS: "com.nek777.mytripapp",
      disableNaverAppAuthIOS: true,
    });
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
          onPress={signInWithNaver}
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
