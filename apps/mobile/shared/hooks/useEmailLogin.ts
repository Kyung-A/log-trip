import { useCallback } from "react";
import { emailLogin } from "../api";
import { router } from "expo-router";
import { checkIfUserExists } from "../lib/checkIfUserExists";

export const useEmailLogin = () => {
  return useCallback(async (email: string, password: string) => {
    try {
      const {
        data: { session, user },
        error,
      } = await emailLogin(email, password);

      if (error?.message) {
        return error?.message;
      }

      const isUserExists = await checkIfUserExists(user.id);

      if (isUserExists) {
        router.replace({
          pathname: "/(tabs)",
          params: {
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
          },
        });
      } else {
        router.replace({
          pathname: "/(auth)/phone-auth",
          params: {
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            platform: "email",
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
};
