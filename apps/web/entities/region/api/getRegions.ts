import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

import { IRegion } from "..";

export const getRegions = async (
  filters?: string | null,
): Promise<IRegion[] | null> => {
  const fetchRegions = unstable_cache(
    async () => {
      let q = supabase.from("adm_regions").select("*");

      if (filters) {
        q = q.or(filters);
      }

      const { data, error } = await q;
      if (error) throw error;

      return data;
    },
    ["all-regions", filters ?? "default"],
    { tags: ["all-regions"] },
  );

  const supabase = await createServerClient();
  return await fetchRegions();
};
