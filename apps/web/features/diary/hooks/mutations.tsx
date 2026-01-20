import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { diaryInvalidateKeys, diaryKeys } from "./queryKeys";
import { createDiary, deleteDiary, updateIsReport } from "../apis";
import { IDiary } from "..";
import { updateIsPublic } from "../apis/updateIsPublic";

const diaryMutatins = {
  create: () =>
    mutationOptions({
      mutationFn: (data: IDiary) => createDiary(data),
    }),

  update: () =>
    mutationOptions({
      mutationFn: ({ id, state }: { id: string; state: boolean }) =>
        updateIsPublic(id, state),
    }),

  remove: () =>
    mutationOptions({
      mutationFn: (data: IDiary) => deleteDiary(data),
    }),

  report: () =>
    mutationOptions({
      mutationFn: (id: string) => updateIsReport(id),
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

export const useUpdateIsPublic = () => {
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
          list.filter((d) => d.id !== id),
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

export const useUpdateIsReport = () => {
  const qc = useQueryClient();

  return useMutation({
    ...diaryMutatins.report(),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: diaryKeys.feed() });

      const prevData = qc.getQueriesData({
        queryKey: diaryKeys.feed(),
      });

      prevData.forEach(([key, list]) => {
        if (!Array.isArray(list)) return;
        qc.setQueryData(
          key,
          list.filter((d) => d.id !== id),
        );
      });

      qc.removeQueries({ queryKey: diaryKeys.detail(id!), exact: true });

      return { prevData };
    },
    onError: (_error) => {
      console.error("삭제 중 서버 에러 발생:", _error);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: diaryKeys.mine() });
      qc.invalidateQueries({ queryKey: diaryKeys.feed() });
    },
  });
};
