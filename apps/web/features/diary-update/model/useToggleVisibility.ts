import { useMutation, useQueryClient } from "@tanstack/react-query";

import { diaryKeys, updateIsPublic } from "@/entities/diary";

export const useToggleVisibility = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, state }: { id: string; state: boolean }) =>
      updateIsPublic(id, state),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: diaryKeys.mine() });
    },
  });
};
