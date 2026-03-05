import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

const fetchDiaries = (supabase: SupabaseClient, userId: string) =>
  unstable_cache(
    async () => {
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
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      return data;
    },
    ["diaries", userId],
    { tags: ["diaries", `diaries-${userId}`] },
  )();

export const getDiaries = async (userId?: string) => {
  if (!userId) throw new Error("id가 없습니다");
  const supabase = await createServerClient();
  return await fetchDiaries(supabase, userId);
};
