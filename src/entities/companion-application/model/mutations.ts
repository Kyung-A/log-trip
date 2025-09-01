import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apply, cancelApply } from '../api';
import { IApply, IApplyStatus } from './types';
import { applicationKeys } from './queryKeys';
import { companionsKeys } from '@/entities/companion/model/queryKeys';

const applicationMutations = {
  apply: () =>
    mutationOptions({
      mutationFn: (data: IApply) => apply(data),
    }),
  cancel: () =>
    mutationOptions({
      mutationFn: (data: IApplyStatus) => cancelApply(data),
    }),
};

export const useApply = () => {
  const qc = useQueryClient();

  return useMutation({
    ...applicationMutations.apply(),
    onSuccess: (_, { companion_id }) => {
      qc.invalidateQueries({
        queryKey: applicationKeys.mine(),
        refetchType: 'active',
      });
      qc.invalidateQueries({
        queryKey: companionsKeys.detail(companion_id),
        exact: true,
        refetchType: 'active',
      });
    },
  });
};

export const useCancelApply = () => {
  const qc = useQueryClient();

  return useMutation({
    ...applicationMutations.cancel(),
    onMutate: async ({ companion_id, id }) => {
      await qc.cancelQueries({ queryKey: applicationKeys.mine() });

      const prevData = qc.getQueryData<IApplyStatus[]>(applicationKeys.mine());

      if (prevData) {
        qc.setQueryData(
          applicationKeys.mine(),
          prevData.map(a => (a.id === id ? { ...a, status: 'cancelled' } : a)),
        );
      }

      return { prevData, companion_id };
    },
    onSuccess: (_, { companion_id }) => {
      qc.invalidateQueries({
        queryKey: applicationKeys.mine(),
        refetchType: 'active',
      });
      qc.invalidateQueries({
        queryKey: applicationKeys.byCompanion(companion_id),
        refetchType: 'active',
      });
      qc.invalidateQueries({
        queryKey: companionsKeys.detail(companion_id),
        exact: true,
        refetchType: 'active',
      });
    },
  });
};
