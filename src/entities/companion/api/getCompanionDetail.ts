import { supabase } from '@/shared';

export const getCompanionDetail = async (id: string) => {
  try {
    const { data } = await supabase
      .from('companions')
      .select(
        `
            *,
            user_info:user_id ( nickname, gender, about, profile_image ),
            companion_regions ( * )
        `,
      )
      .eq('id', id)
      .single();

    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
