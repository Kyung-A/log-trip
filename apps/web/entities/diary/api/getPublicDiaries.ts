import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

export const getPublicDiaries = async (
  page: number = 1,
  limit: number = 10,
) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const fetchPublicDiaries = unstable_cache(
    async (p: number, l: number) => {
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
        .order("updated_at", { ascending: false })
        .range(from, to);

      if (error) throw new Error(error.message);
      return data;
    },
    ["public-diaries", page.toString(), limit.toString()],
    { tags: ["public-diaries"] },
  );

  const supabase = await createServerClient();
  return await fetchPublicDiaries(page, limit);
};
