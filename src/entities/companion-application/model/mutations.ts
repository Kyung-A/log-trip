import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apply } from '../api';
import { IApply } from './types';
import { applicationKeys } from './queryKeys';

const applicationMutations = {
  apply: () =>
    mutationOptions({
      mutationFn: (data: IApply) => apply(data),
    }),
};

export const useApply = () => {
  const qc = useQueryClient();

  return useMutation({
    ...applicationMutations.apply(),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: applicationKeys.mine(),
        refetchType: 'active',
      });
    },
  });
};
