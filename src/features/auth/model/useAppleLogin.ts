import * as AppleAuthentication from "expo-apple-authentication";
import { useCallback } from "react";
import { checkIfUserExists } from "../lib";
import { useNavigation } from "@react-navigation/native";
import { getUser } from "@/entities/auth";
import { generateRawNonce, sha256Hex, supabase } from "@/shared";

export const useAppleLogin = () => {
  const navigation = useNavigation();

  return useCallback(async () => {
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

      const { identityToken } = credential;
      if (!identityToken) throw new Error("identityToken is null");

      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: identityToken,
        nonce: rawNonce,
      });

      if (error) throw new Error("error apply supabase");

      const user = await getUser();
      const isUserExists = await checkIfUserExists(user.id);

      navigation.navigate(isUserExists ? "Home" : "PhoneAuth", {
        platform: "apple",
      });
    } catch (error) {
      console.error(error);
    }
  }, []);
};
