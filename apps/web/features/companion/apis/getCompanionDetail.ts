import { supabase } from "@/shared";

export const getCompanionDetail = async (id: string) => {
  const { data, error } = await supabase
    .from("companions")
    .select(
      `
            *,
            user_info:user_id ( nickname, gender, about, profile_image ),
            companion_regions ( * ),
            applications:companion_applications (
              id, status, message, applicant_id
            )
        `
    )
    .eq("id", id)
    .in("applications.status", ["pending", "accepted"])
    .single();

  if (error) throw new Error(error.message);
  return data;
};
