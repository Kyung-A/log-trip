import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

export const getDiaries = async (
  userId?: string,
  page: number = 1,
  limit: number = 10,
) => {
  if (!userId) throw new Error("id가 없습니다");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const fetchDiaries = unstable_cache(
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
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw new Error(error.message);

      return data;
    },
    ["diaries", userId, page.toString(), limit.toString()],
    { tags: ["diaries", `diaries-${userId}`] },
  );

  const supabase = await createServerClient();
  return await fetchDiaries(page, limit);
};
