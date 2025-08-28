import { supabase } from "@/shared";

export const getRegions = async (filters?: string) => {
  try {
    let q = supabase.from("adm_regions").select("*");

    if (filters) {
      q = q.or(filters);
    }

    const { data } = await q;

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
