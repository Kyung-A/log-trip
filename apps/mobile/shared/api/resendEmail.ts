import { supabase } from "@/shared";

export const resendEmail = async (email: string) => {
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email: email,
  });

  return { data, error };
};
