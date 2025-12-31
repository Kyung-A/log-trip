import { supabase } from "@/shared";

export const updateIsPublicDiary = async (id: string, state: boolean) => {
  const { status, error } = await supabase
    .from("diaries")
    .update({ is_public: state })
    .eq("id", id);

  if (error) throw new Error(error.message);

  return status;
};
