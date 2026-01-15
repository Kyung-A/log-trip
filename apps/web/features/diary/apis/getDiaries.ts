import { supabase } from "@/shared";

export const getDiaries = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const { data, error } = await supabase
    .from("diaries")
    .select(
      `
      *,
      user_info:user_id ( email, name, nickname, profile_image, about ),
      diary_images (id, url),
      diary_regions ( * )
    `
    )
    .eq("user_id", session?.user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return data;
};
