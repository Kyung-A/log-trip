import { supabase } from '@/shared';
import { status } from '../model';

export const getMyApplyStatus = async (status: status) => {
  try {
    let q = supabase
      .from('companion_applications')
      .select('*, companion:companions(title)');

    if (status) {
      q = q.eq('status', status);
    }

    const { data } = await q;

    return data;
  } catch (e) {
    console.error(e);
    return e;
  }
};
