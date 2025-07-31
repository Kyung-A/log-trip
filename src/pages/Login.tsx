import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import * as Random from "expo-random";
import * as WebBrowser from "expo-web-browser";
import { Image, Pressable, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect } from "react";
import { getUser, getUserProfile, signInSNS } from "@/apis";
import NaverLogin from "@react-native-seoul/naver-login";
import { type Provider } from "@supabase/supabase-js";

function generateNonce(length = 32) {
  const bytes = Random.getRandomBytes(length);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256Hex(str: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, str, {
    encoding: Crypto.CryptoEncoding.HEX,
  });
}

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
      let userId = "";

      const profileResult = await NaverLogin.getProfile(
        successResponse!.accessToken
      );

      const {
        data: { user: loginUser },
      } = await supabase.auth.signInWithPassword({
        email: profileResult.response.email,
        password: `${process.env.NAVER_USER_PASSWORD}${profileResult.response.id}`,
      });

      if (!loginUser) {
        const {
          data: { user: signUpUser },
          error,
        } = await supabase.auth.signUp({
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

        userId = signUpUser.id;
      } else {
        userId = loginUser.id;
      }

      const isUserExists = await checkIfUserExists(userId);

      if (isUserExists) {
        navigation.navigate("Home");
      } else {
        navigation.navigate("PhoneAuth", {
          platform: "naver",
        });
      }
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
          className="h-12 justify-center rounded-full w-[240px] border border-[#a38f86]"
        >
          <Text className="font-bold text-lg text-center text-[#a38f86]">
            카카오 로그인
          </Text>
        </Pressable>
        <Pressable
          onPress={signInWithNaver}
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
          onPress={async () => {
            const rawNonce = generateNonce();
            const hashedNonce = await sha256Hex(rawNonce);

            try {
              const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
                nonce: rawNonce,
              });

              const { identityToken } = credential;

              if (identityToken) {
                const {
                  error,
                  data: { user },
                } = await supabase.auth.signInWithIdToken({
                  provider: "apple",
                  token: identityToken,
                  nonce: rawNonce,
                });

                console.log(error, user);
              }
            } catch (error) {
              console.error(error);
            }
          }}
        />
      </View>
    </View>
  );
}
