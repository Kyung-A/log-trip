import { supabase } from "@/shared";
import { IRegion } from "..";

export const getRegions = async (
  filters?: string | null
): Promise<IRegion[] | null> => {
  let q = supabase.from("adm_regions").select("*");

  if (filters) {
    q = q.or(filters);
  }

  const { data, error } = await q;

  if (error) throw error;

  return data;
};
