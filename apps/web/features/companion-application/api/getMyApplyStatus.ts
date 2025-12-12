import { supabase } from "@/shared";
import { status } from "../hooks";

export const getMyApplyStatus = async (userId: string, status?: status) => {
  try {
    let q = supabase
      .from("companion_applications")
      .select("*, companion:companions(title)")
      .eq("applicant_id", userId)
      .order("status", { ascending: true })
      .order("created_at", { ascending: false });

    if (status) {
      q = q.eq("status", status);
    }

    const { data } = await q;

    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
