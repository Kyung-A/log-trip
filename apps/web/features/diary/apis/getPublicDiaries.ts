import { supabase } from "@/shared";

export const getPublicDiaries = async () => {
  const { data, error } = await supabase
    .from("diaries")
    .select(
      `
        *,
        user_info:user_id ( email, nickname, profile_image, about ),
        diary_images (id, url),
        diary_regions ( * )
    `,
    )
    .eq("is_public", true)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};
