import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

const fetchDiaryRegions = (userId: string, supabase: SupabaseClient) =>
  unstable_cache(
    async () => {
      const { data } = await supabase
        .from("diary_regions")
        .select(`*, diaries!inner(user_id)`)
        .eq("diaries.user_id", userId);

      return data;
    },
    ["diary-regions", userId],
    { tags: ["diary-regions", `diary-regions-${userId}`] },
  )();

export const getDiaryRegions = async (id?: string | null) => {
  if (!id) throw new Error("id가 없습니다");
  const supabase = await createServerClient();
  return await fetchDiaryRegions(id, supabase);
};
