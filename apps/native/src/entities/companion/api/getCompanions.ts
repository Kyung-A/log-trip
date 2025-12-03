import { supabase } from '@/shared';

export const getCompanions = async () => {
  try {
    const { data } = await supabase
      .from('companions')
      .select(
        `
            *,
            user_info:user_id ( nickname, profile_image, gender ),
            companion_regions ( * )
        `,
      )
      .gte('deadline_at', new Date().toISOString())
      .order('created_at', { ascending: true });

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
