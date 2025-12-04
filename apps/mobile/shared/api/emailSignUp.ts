import { supabase } from "@/shared";
import * as Linking from "expo-linking";

export const emailSignUp = async (
  email: string,
  password: string,
  name?: string
) => {
  const redirectTo = Linking.createURL("/auth/callback");

  try {
    const response = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          email_verified: true,
          email: email,
        },
        emailRedirectTo: redirectTo,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
