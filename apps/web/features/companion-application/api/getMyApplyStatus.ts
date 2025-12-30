import { supabase } from "@/shared";
import { status } from "../types";

export const getMyApplyStatus = async (userId?: string, status?: status) => {
  if (!userId) throw new Error("id가 없습니다");

  let q = supabase
    .from("companion_applications")
    .select("*, companion:companions(title)")
    .eq("applicant_id", userId)
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  if (status) {
    q = q.eq("status", status);
  }

  const { data, error } = await q;

  if (error) throw new Error(error.message);
  return data;
};
