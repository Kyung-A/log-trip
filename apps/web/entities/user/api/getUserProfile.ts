import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

export const getUserProfile = async (userId?: string) => {
  if (!userId) {
    return { data: null };
  }

  const fetchProfile = unstable_cache(
    async () => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      return data;
    },
    ["user-profile", userId!],
    { tags: ["user-profile", `user-profile-${userId}`], revalidate: 86400 },
  );

  const supabase = await createServerClient();
  const data = await fetchProfile();
  return { data };
};
