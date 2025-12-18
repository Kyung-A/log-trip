import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { diaryKeys, diaryRegionKeys } from "./queryKeys";
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
      qc.invalidateQueries({ queryKey: ["myCounters"] });
      qc.invalidateQueries({ queryKey: diaryKeys.list(data.user_id) });
      qc.invalidateQueries({
        queryKey: diaryRegionKeys.byUser(data.user_id),
        exact: true,
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
      qc.invalidateQueries({ queryKey: ["myCounters"] });
      qc.invalidateQueries({
        queryKey: diaryKeys.list(data.user_id),
        refetchType: "active",
      });
      qc.invalidateQueries({
        queryKey: diaryRegionKeys.byUser(data.user_id),
        exact: true,
        refetchType: "all",
      });
    },
  });
};
