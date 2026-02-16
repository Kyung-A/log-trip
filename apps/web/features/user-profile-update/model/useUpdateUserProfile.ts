import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IUpdateProfileData, updateUserProfile } from "@/entities/user";

export const useUpdateUserProfile = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: IUpdateProfileData) => updateUserProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["profile"],
        refetchType: "active",
        exact: true,
      });
    },
  });
};
