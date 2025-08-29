import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { createDiary, deleteDiary } from '../api';
import { diaryKeys, diaryRegionKeys } from './queryKeys';
import { IDiary } from '.';

const diaryMutatins = {
  create: () =>
    mutationOptions({
      mutationFn: (data: IDiary) => createDiary(data),
    }),

  remove: () =>
    mutationOptions({
      mutationFn: (data: IDiary) => deleteDiary(data),
    }),
};

export const useMutationCreateDiary = () => {
  const qc = useQueryClient();

  return useMutation({
    ...diaryMutatins.create(),
    onSuccess: (_, data) => {
      qc.invalidateQueries({ queryKey: diaryKeys.list(data.user_id) });
      qc.invalidateQueries({
        queryKey: diaryRegionKeys.byUser(data.user_id),
        exact: true,
      });
    },
  });
};

export const useMutationDeleteDiary = () => {
  const qc = useQueryClient();

  return useMutation({
    ...diaryMutatins.remove(),
    onMutate: async ({ id, user_id }) => {
      await qc.cancelQueries({ queryKey: diaryKeys.list(user_id) });

      const prevData = qc.getQueriesData({
        queryKey: diaryKeys.list(user_id),
      })[0];

      prevData.forEach(([key, list]) => {
        if (!Array.isArray(list)) return;
        qc.setQueryData(
          key,
          list.filter(d => d.id !== id),
        );
      });

      qc.removeQueries({ queryKey: diaryKeys.detail(id), exact: true });

      return { prevData };
    },
    onError: (_error, _data, ctx) => {
      ctx?.prevData?.forEach(([key, data]) => qc.setQueriesData(key, data));
    },
    onSuccess: (_, data) => {
      qc.invalidateQueries({
        queryKey: diaryKeys.list(data.user_id),
        refetchType: 'active',
      });
      qc.invalidateQueries({
        queryKey: diaryRegionKeys.byUser(data.user_id),
        exact: true,
        refetchType: 'active',
      });
    },
  });
};
