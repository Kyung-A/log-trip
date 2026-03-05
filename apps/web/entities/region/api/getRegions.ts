import { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared";

import { IRegion } from "..";

const fetchRegions = (supabase: SupabaseClient, filters?: string | null) =>
  unstable_cache(
    async () => {
      let q = supabase.from("adm_regions").select("*");

      if (filters) {
        q = q.or(filters);
      }

      const { data, error } = await q;
      if (error) throw error;

      return data;
    },
    ["all-regions"],
    { tags: ["all-regions"] },
  )();

export const getRegions = async (
  filters?: string | null,
): Promise<IRegion[] | null> => {
  const supabase = await createServerClient();
  return await fetchRegions(supabase, filters);
};
