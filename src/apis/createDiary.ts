import { supabase } from "@/lib";

export interface IDiaryFormData {
  user_id: string | null;
  title: string | null;
  text_content: string | null;
  drawing_content: string | null;
  is_drawing: boolean;
  travel_date: string | null;
  diary_images: string[] | null;
  diary_regions: string[] | null;
}

export const createDiary = async (data: IDiaryFormData) => {
  const { diary_images, diary_regions, ...post } = data;

  const { data: diaryData, error: diaryError } = await supabase
    .from("diaries")
    .insert(post)
    .select()
    .single();

  if (diaryError) throw new Error("다이어리 생성 실패");

  const diaryId = diaryData.id;

  const imageRows = diary_images.map((v: string) => ({
    diary_id: diaryId,
    url: v,
  }));

  const { error: imagesError } = await supabase
    .from("diary_images")
    .insert(imageRows);

  if (imagesError) throw new Error("다이어리 이미지 저장 실패");

  const regionRows = diary_regions.map((v: string) => ({
    diary_id: diaryId,
    region_code: v,
  }));

  const { error: regionError } = await supabase
    .from("diary_regions")
    .insert(regionRows);

  if (regionError) throw new Error("도시 저장 실패");

  return diaryId;
};
