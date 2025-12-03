import { supabase } from "@/shared";

export const getDiaryRegions = async (id: string) => {
  try {
    const { data } = await supabase
      .from("diary_regions")
      .select(
        `
            *, 
            diaries!inner(user_id)
        `
      )
      .eq("diaries.user_id", id);

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
