import { supabase } from "@/shared";

export const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error.message;
  return user;
};
