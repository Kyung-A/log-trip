import { supabase } from "@/shared";

export const getUserProfile = async (id?: string | null) => {
  if (!id) throw new Error("id가 없습니다");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};
