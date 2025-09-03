import { supabase } from '@/shared';

export const getMyCounter = async (userId: string) => {
  try {
    const { data } = await supabase.rpc('get_user_counters', {
      p_user_id: userId,
    });

    return data[0];
  } catch (error) {
    console.error(error);
    return error;
  }
};
