import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

const fetchPublicDiaries = (supabase: SupabaseClient) =>
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
        .eq("is_public", true)
        .eq("is_report", false)
        .order("updated_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    ["public-diaries"],
    { tags: ["public-diaries"] },
  )();

export const getPublicDiaries = async () => {
  const supabase = await createServerClient();
  return await fetchPublicDiaries(supabase);
};
