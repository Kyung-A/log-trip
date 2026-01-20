import { supabase } from "@/shared";

export const getUserProfile = async (id?: string | null) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error.message;
  return data;
};
