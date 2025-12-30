import { supabase } from "@/shared";
import { IApplicantsForMyPost, status } from "../types";

export const getApplicantsForMyPosts = async (
  userId?: string,
  status?: status
) => {
  if (!userId) throw new Error("id가 없습니다");

  let q = supabase
    .from("companion_applications")
    .select(
      `
          id, status, message, applicant_id, created_at,
          applicant:users!inner ( id, nickname, profile_image ),
          companion:companions!inner ( id, title )
        `
    )
    .eq("companion.user_id", userId)
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  if (status) {
    q = q.in("applications.status", [status]);
  }

  const { data, error } = await q;

  if (error) throw new Error(error.message);

  return data as unknown as IApplicantsForMyPost[];
};
