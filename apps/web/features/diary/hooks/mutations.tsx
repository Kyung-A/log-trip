import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { diaryInvalidateKeys, diaryKeys } from "./queryKeys";
import { createDiary, deleteDiary } from "../apis";
import { IDiary } from "..";

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

export const useDeleteDiary = () => {
  const qc = useQueryClient();

  return useMutation({
    ...diaryMutatins.remove(),
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: diaryKeys.list() });

      const prevData = qc.getQueriesData({
        queryKey: diaryKeys.list(),
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
