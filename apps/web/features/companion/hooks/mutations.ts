import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ICompanionRequest } from "../types";
import { companionsKeys } from "./queryKeys";
import { createCompanions, updateCompanions, deleteCompanion } from "..";

const companionMutations = {
  create: () =>
    mutationOptions({
      mutationFn: (data: ICompanionRequest) => createCompanions(data),
    }),
  update: () =>
    mutationOptions({
      mutationFn: (data: ICompanionRequest) => updateCompanions(data),
    }),
  delete: () =>
    mutationOptions({
      mutationFn: async (postId: string): Promise<number> =>
        deleteCompanion(postId),
    }),
};

export const useCreateCompanion = () => {
  const qc = useQueryClient();

  return useMutation({
    ...companionMutations.create(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: companionsKeys.lists() });
    },
  });
};

export const useUpdateCompanion = () => {
  const qc = useQueryClient();

  return useMutation({
    ...companionMutations.update(),
    onSuccess: (_, data) => {
      qc.invalidateQueries({
        queryKey: companionsKeys.detail(data.id!),
        exact: true,
        refetchType: "active",
      });
      qc.invalidateQueries({
        queryKey: companionsKeys.list(data.id!),
        refetchType: "active",
      });
    },
  });
};

export const useDeleteCompanion = () => {
  const qc = useQueryClient();

  return useMutation<number, Error, string>({
    ...companionMutations.delete(),
    onSuccess: (_, postId) => {
      qc.invalidateQueries({
        queryKey: ["myCounters"],
        refetchType: "active",
      });
      qc.invalidateQueries({ queryKey: companionsKeys.lists() });
      qc.removeQueries({ queryKey: companionsKeys.detail(postId) });
    },
  });
};
