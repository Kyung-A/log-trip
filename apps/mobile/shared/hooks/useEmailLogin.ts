import { useCallback } from "react";
import { emailLogin } from "../api";
import { router } from "expo-router";
import { checkIfUserExists } from "../lib/checkIfUserExists";

export const useEmailLogin = () => {
  return useCallback(async (email: string, password: string) => {
    try {
      const {
        data: { user },
        error,
      } = await emailLogin(email, password);

      if (error?.message) {
        return error?.message;
      }

      const isUserExists = await checkIfUserExists(user.id);

      if (isUserExists) {
        router.push("/(tabs)");
      } else {
        // navigation.navigate('PhoneAuth', {
        //   platform: 'email',
        // });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
};
