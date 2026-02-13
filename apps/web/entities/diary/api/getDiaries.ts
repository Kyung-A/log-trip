import { supabase } from "@/shared";

export const getDiaries = async () => {
  let result = [];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id) {
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
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    result = data;
  }

  return result;
};
