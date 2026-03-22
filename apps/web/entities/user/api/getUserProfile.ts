import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

export const getUserProfile = async (userId?: string) => {
  const fetchProfile = unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw new Error(error.message);

      return data;
    },
    ["user-profile", userId!],
    { tags: ["user-profile", `user-profile-${userId}`], revalidate: 86400 },
  );

  const supabase = await createServerClient();
  const data = await fetchProfile();
  return { data };
};
