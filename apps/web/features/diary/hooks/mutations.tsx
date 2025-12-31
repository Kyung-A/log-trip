import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { diaryInvalidateKeys, diaryKeys } from "./queryKeys";
import { createDiary, deleteDiary } from "../apis";
import { IDiary } from "..";
import { updateIsPublicDiary } from "../apis/updateIsPublicDiary";

const diaryMutatins = {
  create: () =>
    mutationOptions({
      mutationFn: (data: IDiary) => createDiary(data),
    }),

  update: () =>
    mutationOptions({
      mutationFn: ({ id, state }: { id: string; state: boolean }) =>
        updateIsPublicDiary(id, state),
    }),

  remove: () =>
    mutationOptions({
      mutationFn: (data: IDiary) => deleteDiary(data),
    }),
};

export const useCreateDiary = () => {
  const qc = useQueryClient();

  return useMutation({
    ...diaryMutatins.create(),
    onSuccess: (_, data) => {
      diaryInvalidateKeys(data.user_id).forEach((key) => {
        qc.invalidateQueries(key);
      });
    },
  });
};

export const useUpdateIsPublicDiary = () => {
  const qc = useQueryClient();

  return useMutation({
    ...diaryMutatins.update(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: diaryKeys.mine() });
    },
  });
};

export const useDeleteDiary = () => {
  const qc = useQueryClient();

  return useMutation({
    ...diaryMutatins.remove(),
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: diaryKeys.mine() });

      const prevData = qc.getQueriesData({
        queryKey: diaryKeys.mine(),
      });

      prevData.forEach(([key, list]) => {
        if (!Array.isArray(list)) return;
        qc.setQueryData(
          key,
          list.filter((d) => d.id !== id)
        );
      });

      qc.removeQueries({ queryKey: diaryKeys.detail(id!), exact: true });

      return { prevData };
    },
    onError: (_error, _data, ctx) => {
      ctx?.prevData?.forEach(([key, data]) => {
        qc.setQueriesData({ queryKey: key }, data);
      });
    },
    onSuccess: (_, data) => {
      diaryInvalidateKeys(data.user_id).forEach((key) => {
        qc.invalidateQueries(key);
      });
    },
  });
};
