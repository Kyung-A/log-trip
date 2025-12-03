import { supabase } from '@/shared';

export const deleteCompanion = async (id: string) => {
  try {
    await supabase.from('companion_regions').delete().eq('companion_id', id);
    const response = await supabase.from('companions').delete().eq('id', id);
    return response;
  } catch (e) {
    console.error(e);
    return e;
  }
};
