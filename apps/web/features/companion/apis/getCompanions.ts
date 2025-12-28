import { supabase } from "@/shared";

export const getCompanions = async () => {
  const { data, error } = await supabase
    .from("companions")
    .select(
      `
            *,
            user_info:user_id ( nickname, profile_image, gender ),
            companion_regions ( * )
        `
    )
    .gte("deadline_at", new Date().toISOString())
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);

  return data;
};
