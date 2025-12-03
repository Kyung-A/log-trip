import { supabase } from '@/shared';
import { status } from '../model';

export const getApplicantsForMyPosts = async (
  userId: string,
  status?: status,
) => {
  try {
    let q = supabase
      .from('companion_applications')
      .select(
        `
          id, status, message, applicant_id, created_at,
          applicant:users!inner ( id, nickname, profile_image ),
          companion:companions!inner ( id, title )
        `,
      )
      .eq('companion.user_id', userId)
      .order('status', { ascending: true })
      .order('created_at', { ascending: false });

    if (status) {
      q = q.in('applications.status', [status]);
    }

    const { data } = await q;

    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
