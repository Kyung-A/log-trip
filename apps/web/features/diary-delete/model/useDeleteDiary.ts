import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteDiary,
  diaryInvalidateKeys,
  diaryKeys,
  IDiary,
} from "@/entities/diary";

export const useDeleteDiary = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: IDiary) => deleteDiary(data),
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
