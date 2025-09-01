import { supabase } from '@/shared';
import { IAcceptCompanion } from '../model';

export const acceptCompanion = async (data: IAcceptCompanion) => {
  const { companion_id, ...body } = data;

  try {
    const response = await supabase
      .from('companion_applications')
      .update({ ...body, status: 'accepted' })
      .in('status', ['pending'])
      .eq('id', body.id);

    return response;
  } catch (e) {
    console.error(e);
    return e;
  }
};
