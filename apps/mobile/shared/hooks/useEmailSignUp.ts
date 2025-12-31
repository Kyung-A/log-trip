import { useCallback } from "react";
import { emailSignUp } from "../api";
import Toast from "react-native-toast-message";

export const useEmailSignUp = () => {
  return useCallback(async (email: string, password: string) => {
    const result = await emailSignUp(email, password);

    if (result) {
      Toast.show({
        type: "success",
        text1: "입력하신 이메일의 메일함을 확인해주세요.",
      });
    }
  }, []);
};
