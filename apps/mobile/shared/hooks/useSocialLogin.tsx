import { useCallback } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { login } from "@react-native-seoul/kakao-login";
import NaverLogin from "@react-native-seoul/naver-login";
import { generateRawNonce, sha256Hex, supabase } from "@/shared";
import { checkIfUserExists } from "../lib/checkIfUserExists";
import { router } from "expo-router";

export const useSocialLogin = () => {
  // * 카카오 로그인
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
          pathname: "/(auth)/user-info",
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

  // * 네이버 로그인
  const naverLogin = useCallback(async () => {
    const { failureResponse, successResponse } = await NaverLogin.login();

    if (failureResponse) throw new Error(failureResponse.message);
    if (!successResponse) throw new Error("네이버 로그인 실패");

    const profileResult = await NaverLogin.getProfile(
      successResponse!.accessToken
    );
    const { email, id, name } = profileResult.response;

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_SUPABASE_API_ENDPOINT}/naver-auth`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_API_KEY}`,
        },
        body: JSON.stringify({
          id,
          email,
          name,
          refreshToken: successResponse.refreshToken,
        }),
      }
    );

    const { nextPhoneAuth, session } = await response.json();
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (nextPhoneAuth) {
      router.replace({
        pathname: "/(auth)/user-info",
        params: {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          platform: "naver",
        },
      });
    } else {
      router.replace({
        pathname: "/(tabs)",
        params: {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
        },
      });
    }
  }, []);

  // * 애플 로그인
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

      const { identityToken, authorizationCode, fullName, email } = credential;
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
            email: email,
            name: displayName,
          },
        });

        if (updateError) throw new Error("error update full name");
      }

      // * users 테이블에 이미 있다면 메인으로 이동
      const isUserExists = await checkIfUserExists(data.user.id);
      if (isUserExists) {
        router.replace({
          pathname: "/(tabs)",
          params: {
            accessToken: data?.session.access_token,
            refreshToken: data?.session.refresh_token,
          },
        });
        return;
      }

      // * users 테이블에 없다면 추가 회원가입 로직 실행
      if (authorizationCode) {
        try {
          await supabase.functions.invoke("apple-auth", {
            body: { code: authorizationCode, userId: data.user.id, email },
          });
        } catch (funcError) {
          console.error("애플 토큰 교환 실패:", funcError);
        }
      }

      router.replace({
        pathname: "/(auth)/user-info",
        params: {
          accessToken: data?.session.access_token,
          refreshToken: data?.session.refresh_token,
          platform: "apple",
        },
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return { naverLogin, appleLogin, kakaoLogin };
};
