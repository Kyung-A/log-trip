import { supabase } from '@/shared';
import { ICompanionRequest } from '../model';

export const createCompanions = async (data: ICompanionRequest) => {
  const { companion_regions, ...post } = data;

  try {
    const response = await supabase
      .from('companions')
      .insert(post)
      .select()
      .single();

    const {
      data: { id },
    } = response;

    if (!id) throw new Error('동행 게시물 생성 실패');

    const row = companion_regions.map(v => ({ companion_id: id, ...v }));
    const { error } = await supabase.from('companion_regions').insert(row);

    if (error) throw new Error('동행 게시물 도시 데이터 저장 실패');

    return response;
  } catch (e) {
    console.error(e);
    return e;
  }
};
