import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteUser } from "@/entities/user";

export const useDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: { id?: string; platform?: string }) =>
      deleteUser(data.id, data.platform),
    onSuccess: () => {
      qc.clear();
    },
  });
};
