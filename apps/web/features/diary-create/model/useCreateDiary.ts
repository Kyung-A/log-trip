import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createDiary, diaryInvalidateKeys, IDiary } from "@/entities/diary";

export const useCreateDiary = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: IDiary) => createDiary(data),
    onSuccess: (_, data) => {
      diaryInvalidateKeys(data.user_id).forEach((key) => {
        qc.invalidateQueries(key);
      });
    },
  });
};
