import { supabase } from '@/shared';
import { IApply } from '../model';

export const apply = async (data: IApply) => {
  try {
    const response = await supabase
      .from('companion_applications')
      .insert(data)
      .select()
      .single();
    return response;
  } catch (e) {
    console.error(e);
    return e;
  }
};
