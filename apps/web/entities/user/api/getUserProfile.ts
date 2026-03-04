import { createClient } from "@/shared";

export const getUserProfile = async (id?: string | null) => {
  const supabase = createClient();

  if (!id) throw new Error("id가 없습니다");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  console.log("getUserProfile", data);

  return data;
};
