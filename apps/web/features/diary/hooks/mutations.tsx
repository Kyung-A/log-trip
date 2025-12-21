import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { diaryInvalidateKeys, diaryKeys } from "./queryKeys";
import { IDiary } from ".";
import { createDiary, deleteDiary } from "../apis";

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
        if (Array.isArray(key)) {
          qc.invalidateQueries({ queryKey: key });
        } else {
          qc.invalidateQueries(key);
        }
      });
    },
  });
};

export const useDeleteDiary = () => {
  const qc = useQueryClient();

  return useMutation({
    ...diaryMutatins.remove(),
    onMutate: async ({ id, user_id }) => {
      await qc.cancelQueries({ queryKey: diaryKeys.list(user_id) });

      const prevData = qc.getQueriesData({
        queryKey: diaryKeys.list(user_id),
      });

      prevData.forEach(([key, list]) => {
        if (!Array.isArray(list)) return;
        qc.setQueryData(
          key,
          list.filter((d) => d.id !== id)
        );
      });

      qc.removeQueries({ queryKey: diaryKeys.detail(id), exact: true });

      return { prevData };
    },
    onError: (_error, _data, ctx) => {
      ctx?.prevData?.forEach(([key, data]) => qc.setQueriesData(key, data));
    },
    onSuccess: (_, data) => {
      diaryInvalidateKeys(data.user_id).forEach((key) => {
        if (Array.isArray(key)) {
          qc.invalidateQueries({ queryKey: key });
        } else {
          qc.invalidateQueries(key);
        }
      });
    },
  });
};
