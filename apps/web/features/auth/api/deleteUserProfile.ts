import { supabase } from '@/shared';

export const deleteUserProfile = async (id: string) => {
  try {
    const { data } = await supabase.from('users').delete().eq('id', id);

    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
