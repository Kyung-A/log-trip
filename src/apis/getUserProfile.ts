import { supabase } from "@/lib";

export const getUserProfile = async (id: string) => {
  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data;
};
