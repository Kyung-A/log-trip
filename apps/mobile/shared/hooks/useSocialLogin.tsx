import { useCallback } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import { login } from "@react-native-seoul/kakao-login";
import NaverLogin from "@react-native-seoul/naver-login";
import {
  checkIfUserExists,
  generateRawNonce,
  setSupabaseCookie,
  sha256Hex,
  supabase,
} from "@/shared";
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
        await setSupabaseCookie(data.session);
        router.replace({
          pathname: "/(tabs)",
        });
      } else {
        router.replace({
          pathname: "/(auth)/user-info",
          params: {
            session: JSON.stringify(data.session),
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
    await NaverLogin.logout(); // 라이브러리측 토큰 삭제 버그 대응
    const { failureResponse, successResponse } = await NaverLogin.login();

    if (failureResponse) throw new Error(failureResponse.message);
    if (!successResponse) throw new Error("네이버 로그인 실패");

    const profileResult = await NaverLogin.getProfile(
      successResponse!.accessToken,
    );
    const { email, id } = profileResult.response;

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
          refreshToken: successResponse.refreshToken,
        }),
      },
    );

    const { nextPhoneAuth, session } = await response.json();
    if (!session) throw new Error("세션 정보가 없습니다.");

    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });

    if (nextPhoneAuth) {
      router.replace({
        pathname: "/(auth)/user-info",
        params: {
          session: JSON.stringify(session),
          platform: "naver",
        },
      });
    } else {
      await setSupabaseCookie(session);
      router.replace({
        pathname: "/(tabs)",
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
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
        nonce: hashedNonce,
      });

      const {
        identityToken,
        authorizationCode,
        email: appleEmail,
      } = credential;
      if (!identityToken) throw new Error("identityToken is null");

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: identityToken,
        nonce: rawNonce,
      });

      if (error) throw new Error("Supabase Auth 로그인 실패");
      const user = data.user;

      if (appleEmail) {
        await supabase.auth.updateUser({ data: { display_email: appleEmail } });
      }

      const isUserExists = await checkIfUserExists(user.id);
      await setSupabaseCookie(data.session);

      if (isUserExists) {
        router.replace("/(tabs)");
        return;
      }

      if (authorizationCode) {
        try {
          await supabase.functions.invoke("apple-auth", {
            body: {
              code: authorizationCode,
              userId: user.id,
              email: appleEmail || user.email,
            },
          });
        } catch (fError) {
          console.error("Edge Function 호출 실패:", fError);
        }
      }

      router.replace({
        pathname: "/(auth)/user-info",
        params: {
          session: JSON.stringify(data.session),
          platform: "apple",
        },
      });
    } catch (error) {
      console.error("Apple Login Error:", error);
    }
  }, []);

  return { naverLogin, appleLogin, kakaoLogin };
};
