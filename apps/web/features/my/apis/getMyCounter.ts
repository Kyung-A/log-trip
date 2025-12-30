import { supabase } from "@/shared";

export const getMyCounter = async (userId?: string | null) => {
  if (!userId) throw new Error("id가 없습니다");

  const { data, error } = await supabase.rpc("get_user_counters", {
    p_user_id: userId,
  });

  if (error) throw new Error(error.message);

  return data[0];
};
