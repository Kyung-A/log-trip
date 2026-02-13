import { supabase } from "@/shared";
import { IDiaryRegions } from "..";

export const getDiaryRegions = async (
  id?: string | null
): Promise<IDiaryRegions[] | null> => {
  if (!id) throw new Error("id가 없습니다");

  const { data, error } = await supabase
    .from("diary_regions")
    .select(
      `
          *,
          diaries!inner(user_id)
        `
    )
    .eq("diaries.user_id", id);

  if (error) throw error;

  return data;
};
