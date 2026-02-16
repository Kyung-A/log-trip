import { useMutation, useQueryClient } from "@tanstack/react-query";

import { diaryKeys, updateIsReport } from "@/entities/diary";

export const useUpdateIsReport = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateIsReport(id),
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
