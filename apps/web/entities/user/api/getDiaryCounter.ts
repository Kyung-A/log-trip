import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

export const getDiaryCounter = async (userId?: string | null) => {
  if (!userId) {
    return { data: null };
  }

  const fetchDiaryCounter = unstable_cache(
    async () => {
      const { data, error } = await supabase.rpc("get_user_counters", {
        p_user_id: userId,
      });
      if (error) throw new Error(error.message);
      return data[0];
    },
    ["user-diary-counter", userId],
    {
      tags: ["user-diary-counter", `user-diary-counter-${userId}`],
      revalidate: 86400,
    },
  );

  const supabase = await createServerClient();
  const data = await fetchDiaryCounter();
  return { data };
};
