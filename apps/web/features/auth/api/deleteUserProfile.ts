import { supabase } from "@/shared";

export const deleteUserProfile = async (id?: string | null) => {
  if (!id) throw new Error("id가 없습니다");

  const { status, error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw new Error(error.message);

  return status;
};
