import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { ICompanionRequest } from './types';
import { companionsKeys } from './queryKeys';
import { createCompanions } from '../api';

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
