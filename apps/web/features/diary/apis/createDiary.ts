import { supabase } from "@/shared";
import { IDiary } from "..";

export const createDiary = async (data: IDiary) => {
  const { diary_images, diary_regions, ...post } = data;

  const { data: diaryData, error: diaryError } = await supabase
    .from("diaries")
    .insert(post)
    .select()
    .single();

  if (diaryError) throw new Error("다이어리 생성 실패");

  const diaryId = diaryData.id;

  try {
    if (diary_images && diary_images.length > 0) {
      const imageRows = diary_images.map((v) => ({
        diary_id: diaryId,
        url: v.url,
      }));

      const { error: imagesError } = await supabase
        .from("diary_images")
        .insert(imageRows);

      if (imagesError) throw imagesError;
    }

    const regionRows = diary_regions.map((v) => ({
      diary_id: diaryId,
      ...v,
    }));

    const { error: regionError } = await supabase
      .from("diary_regions")
      .insert(regionRows);

    if (regionError) throw regionError;

    return diaryId;
  } catch {
    await supabase.from("diaries").delete().eq("id", diaryId);
    throw new Error("전체 저장 실패로 롤백됨");
  }
};
