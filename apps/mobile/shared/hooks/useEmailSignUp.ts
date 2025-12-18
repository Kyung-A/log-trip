import { useCallback } from "react";
import { emailSignUp } from "../api";

export const useEmailSignUp = () => {
  return useCallback(async (email: string, password: string) => {
    try {
      const response = await emailSignUp(email, password);
      if (response.data) {
        // Toast.show({
        //   type: "success",
        //   text1: "입력하신 이메일의 메일함을 확인해주세요.",
        // });
      }
    } catch (error) {
      console.error(error);
    }
  }, []);
};
