import { supabase } from "@/shared";

export const emailLogin = async (email: string, password: string) => {
  try {
    const response = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
