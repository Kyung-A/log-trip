import { supabase } from "@/shared";

export const getUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return user?.id;
};
