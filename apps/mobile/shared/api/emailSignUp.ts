import { supabase } from "@/shared";
import * as Linking from "expo-linking";

export const emailSignUp = async (
  email: string,
  password: string,
  name?: string
) => {
  const redirectTo = Linking.createURL("/auth/callback");

  const { data, error } = await supabase.auth.signUp({
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

  if (error) throw new Error(error.message);

  return data;
};
