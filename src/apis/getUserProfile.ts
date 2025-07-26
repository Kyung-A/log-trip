import { supabase } from "@/lib/supabase";

export const getUserProfile = async (id: string) => {
  const { data } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data;
};
