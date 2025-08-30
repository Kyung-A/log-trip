import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { createCompanions } from '../api/createCompanions';
import { ICompanionRequest } from './types';
import { companionsKeys } from './queryKeys';

const companionMutations = {
  create: () =>
    mutationOptions({
      mutationFn: (data: ICompanionRequest) => createCompanions(data),
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
