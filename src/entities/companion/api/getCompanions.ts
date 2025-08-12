import { supabase } from "@/shared";

export const getCompanions = async () => {
  try {
    const { data } = await supabase.from("travel_companions").select(
      `
            *,
            user_info:user_id ( email, nickname, profile_image, about ),
        `
    );

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
