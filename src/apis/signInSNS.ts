import { supabase } from "@/lib/supabase";
import { type Provider } from "@supabase/supabase-js";
import { Platform } from "react-native";

export const signInSNS = async (platform: Provider) => {
  const redirectTo = Platform.select({
    ios: process.env.AUTH_CALLBACK_URL,
    android: process.env.AUTH_CALLBACK_URL,
  });

  const response = await supabase.auth.signInWithOAuth({
    provider: platform,
    options: {
      redirectTo,
    },
  });

  return response;
};
