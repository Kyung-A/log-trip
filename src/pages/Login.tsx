import * as AppleAuthentication from "expo-apple-authentication";
import { Image, Pressable, Text, View } from "react-native";
import { useEffect } from "react";
import NaverLogin from "@react-native-seoul/naver-login";
import { useAppleLogin, useKakaoLogin, useNaverLogin } from "@/features/auth";

export default function LoginScreen() {
  const kakaoLogin = useKakaoLogin();
  const naverLogin = useNaverLogin();
  const applyLogin = useAppleLogin();

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
          onPress={kakaoLogin}
          className="h-12 justify-center rounded-full w-[240px] border border-[#a38f86]"
        >
          <Text className="font-bold text-lg text-center text-[#a38f86]">
            카카오 로그인
          </Text>
        </Pressable>
        <Pressable
          onPress={naverLogin}
          className="h-12 justify-center rounded-full w-[240px] border border-[#a38f86] mt-2"
        >
          <Text className="font-bold text-lg text-center text-[#a38f86]">
            네이버 로그인
          </Text>
        </Pressable>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={999}
          style={{ width: 240, height: 48, marginTop: 8 }}
          onPress={applyLogin}
        />
      </View>
    </View>
  );
}
