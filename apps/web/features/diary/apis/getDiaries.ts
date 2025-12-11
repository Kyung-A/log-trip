import { supabase } from "@/shared";

export const getDiaries = async () => {
  const { data, error, status } = await supabase.from("diaries").select(
    `
      *,
      user_info:user_id ( email, name, nickname, profile_image ),
      diary_images (id, url),
      diary_regions ( * )
    `
  );
  // .maybeSingle();

  console.log("data", data, error, status);

  if (error) throw new Error(error.message);

  return data;
};
