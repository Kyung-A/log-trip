import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

export const getDiaryRegions = async (userId?: string | null) => {
  if (!userId) throw new Error("id가 없습니다");

  const fetchDiaryRegions = unstable_cache(
    async () => {
      const { data } = await supabase
        .from("diary_regions")
        .select(`*, diaries!inner(user_id)`)
        .eq("diaries.user_id", userId);

      return data;
    },
    ["diary-regions", userId],
    { tags: ["diary-regions", `diary-regions-${userId}`] },
  );

  const supabase = await createServerClient();
  return await fetchDiaryRegions();
};
