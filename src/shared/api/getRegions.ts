import { supabase } from "../lib";

export const getRegions = async (filters?: string) => {
  try {
    let q = supabase.from("adm_regions").select("*");

    if (filters) {
      q = q.or(filters);
    }

    return q;
  } catch (error) {
    console.error(error);
    return error;
  }
};
