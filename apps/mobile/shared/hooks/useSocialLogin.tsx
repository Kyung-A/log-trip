import { useCallback } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { login } from "@react-native-seoul/kakao-login";
import NaverLogin from "@react-native-seoul/naver-login";
import {
  emailLogin,
  emailSignUp,
  generateRawNonce,
  sha256Hex,
  supabase,
} from "@/shared";
import { checkIfUserExists } from "../lib/checkIfUserExists";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export const useSocialLogin = () => {
  const kakaoLogin = useCallback(async () => {
    try {
      const { idToken } = await login();

      if (!idToken) {
        throw new Error("Failed to login with Kakao.");
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "kakao",
        token: idToken,
      });

      if (error) {
        throw new Error(error?.message);
      }

      const isUserExists = await checkIfUserExists(data.user.id);
      if (isUserExists) {
        router.replace({
          pathname: "/(tabs)",
          params: {
            accessToken: data?.session.access_token,
            refreshToken: data?.session.refresh_token,
          },
        });
      } else {
        router.replace({
          pathname: "/(auth)/phone-auth",
          params: {
            accessToken: data?.session.access_token,
            refreshToken: data?.session.refresh_token,
            platform: "kakao",
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const naverLogin = useCallback(async () => {
    try {
      const { failureResponse, successResponse } = await NaverLogin.login();
      if (successResponse) {
        let userId = "";

        const profileResult = await NaverLogin.getProfile(
          successResponse!.accessToken
        );

        const { user: loginUser } = await emailLogin(
          profileResult.response.email,
          `${process.env.NAVER_USER_PASSWORD}${profileResult.response.id}`
        );

        if (!loginUser) {
          const { user: signUpUser } = await emailSignUp(
            profileResult.response.email,
            `${process.env.NAVER_USER_PASSWORD}${profileResult.response.id}`,
            profileResult.response.name
          );

          if (!signUpUser) {
            Toast.show({
              type: "error",
              text1: "이미 가입한 이메일입니다. 다른 방법으로 로그인 해주세요.",
            });

            return;
          }

          userId = signUpUser.id;
        } else {
          userId = loginUser.id;
        }

        const isUserExists = await checkIfUserExists(userId);

        if (isUserExists) {
          router.replace({
            pathname: "/(tabs)",
            params: {
              accessToken: successResponse!.accessToken,
              refreshToken: successResponse!.refreshToken,
            },
          });
        } else {
          router.replace({
            pathname: "/(auth)/phone-auth",
            params: {
              accessToken: successResponse!.accessToken,
              refreshToken: successResponse!.refreshToken,
              platform: "naver",
            },
          });
        }
      } else {
        console.error(failureResponse);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const appleLogin = useCallback(async () => {
    const rawNonce = generateRawNonce();
    const hashedNonce = await sha256Hex(rawNonce);

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      const { identityToken, fullName } = credential;
      if (!identityToken) throw new Error("identityToken is null");

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: identityToken,
        nonce: rawNonce,
      });

      if (error) throw new Error("error apply supabase");

      if (fullName) {
        const displayName = fullName
          ? `${fullName.familyName ?? ""}${fullName.givenName ?? ""}`.trim()
          : null;

        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            name: displayName,
          },
        });

        if (updateError) throw new Error("error update full name");
      }

      const isUserExists = await checkIfUserExists(data.user.id);

      if (isUserExists) {
        router.replace({
          pathname: "/(tabs)",
          params: {
            accessToken: data?.session.access_token,
            refreshToken: data?.session.refresh_token,
          },
        });
      } else {
        router.replace({
          pathname: "/(auth)/phone-auth",
          params: {
            accessToken: data?.session.access_token,
            refreshToken: data?.session.refresh_token,
            platform: "apple",
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  return { naverLogin, appleLogin, kakaoLogin };
};
