import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

export const getDiaries = async (
  userId?: string,
  page: number = 1,
  limit: number = 10,
) => {
  if (!userId) throw new Error("id가 없습니다");

  const supabase = await createServerClient();

  const fetchDiaries = unstable_cache(
    async (uid: string, p: number, l: number) => {
      const from = (p - 1) * l;
      const to = from + l - 1;

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
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw new Error(error.message);
      return data;
    },
    ["diaries"],
    { tags: ["diaries", `diaries-${userId}`] },
  );

  return await fetchDiaries(userId, page, limit);
};
