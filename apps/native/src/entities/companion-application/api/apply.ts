import { supabase } from '@/shared';
import { IApply } from '../model';

export const apply = async (data: IApply) => {
  try {
    const response = await supabase
      .from('companion_applications')
      .upsert(
        {
          ...data,
          status: 'pending',
        },
        { onConflict: 'companion_id,applicant_id' },
      )
      .select()
      .single();
    console.log(response);
    return response;
  } catch (e) {
    console.error(e);
    return e;
  }
};
