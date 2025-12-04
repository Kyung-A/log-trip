import { useEffect } from "react";
import { Image } from "expo-image";
import { View, Pressable, Text, TouchableOpacity } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import NaverLogin from "@react-native-seoul/naver-login";
import { useSocialLogin } from "@/shared";

export default function LoginScreen() {
  const { appleLogin } = useSocialLogin();

  useEffect(() => {
    NaverLogin.initialize({
      appName: "로그트립",
      consumerKey: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID ?? "",
      consumerSecret: process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET ?? "",
      serviceUrlSchemeIOS: process.env.EXPO_PUBLIC_SERVICE_URL_SCHEME,
      disableNaverAppAuthIOS: true,
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2eeec",
      }}
    >
      <View style={{ width: 160, height: 160 }}>
        <Image
          source={require("@/assets/images/logo/logtrip-logo.png")}
          style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        />
      </View>

      <View style={{ marginTop: 56 }}>
        <Pressable
          //   onPress={kakaoLogin}
          style={{
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            width: 240,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: "#fee502",
            backgroundColor: "#fee502",
            flexDirection: "row",
            columnGap: 8,
          }}
        >
          <View style={{ width: 20, height: 20 }}>
            <Image
              source={require("@/assets/images/logo/kakao-logo.png")}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              color: "#181600",
            }}
          >
            카카오로 로그인
          </Text>
        </Pressable>

        <Pressable
          //   onPress={naverLogin}
          style={{
            height: 48,
            justifyContent: "center",
            alignItems: "center",
            width: 240,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: "#00c659",
            backgroundColor: "#00c659",
            marginTop: 8,
            flexDirection: "row",
            columnGap: 4,
          }}
        >
          <View style={{ width: 32, height: 32 }}>
            <Image
              source={require("@/assets/images/logo/naver-logo.png")}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              textAlign: "center",
              color: "#ffffff",
            }}
          >
            네이버로 로그인
          </Text>
        </Pressable>

        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={999}
          style={{ width: 240, height: 48, marginTop: 8 }}
          onPress={appleLogin}
        />

        <TouchableOpacity
          // onPress={() => navigation.navigate('EmailLogin')}
          style={{ justifyContent: "center", width: 240, marginTop: 24 }}
        >
          <Text style={{ fontSize: 16, textAlign: "center" }}>
            이메일로 로그인
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
