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
    onSuccess: (_, data) => {
      qc.invalidateQueries({ queryKey: diaryKeys.list(data.user_id) });
      qc.invalidateQueries({
        queryKey: diaryRegionKeys.byUser(data.user_id),
        exact: true,
      });
    },
  });
};
