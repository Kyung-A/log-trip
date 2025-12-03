import {
  mutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { acceptCompanion, apply, cancelApply, rejectCompanion } from '../api';
import {
  IAcceptCompanion,
  IApply,
  IApplyStatus,
  IRejectCompanion,
} from './types';
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
  accept: () =>
    mutationOptions({
      mutationFn: (data: IAcceptCompanion) => acceptCompanion(data),
    }),
  reject: () =>
    mutationOptions({
      mutationFn: (data: IRejectCompanion) => rejectCompanion(data),
    }),
};

export const useApply = () => {
  const qc = useQueryClient();

  return useMutation({
    ...applicationMutations.apply(),
    onSuccess: (_, { companion_id, applicant_id }) => {
      qc.invalidateQueries({
        queryKey: ['myCounters'],
        refetchType: 'active',
      });
      qc.invalidateQueries({
        queryKey: applicationKeys.mine(applicant_id),
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
    onMutate: async ({ companion_id, id, applicant_id }) => {
      await qc.cancelQueries({ queryKey: applicationKeys.mine(applicant_id) });

      const prevData = qc.getQueryData<IApplyStatus[]>(
        applicationKeys.mine(applicant_id),
      );

      if (prevData) {
        qc.setQueryData(
          applicationKeys.mine(applicant_id),
          prevData.map(a => (a.id === id ? { ...a, status: 'cancelled' } : a)),
        );
      }

      return { prevData, companion_id };
    },
    onSuccess: (_, { companion_id, applicant_id }) => {
      qc.invalidateQueries({
        queryKey: applicationKeys.mine(applicant_id),
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

export const useAcceptCompanion = () => {
  const qc = useQueryClient();

  return useMutation({
    ...applicationMutations.accept(),
    onMutate: async ({ decided_by, id, companion_id }) => {
      await qc.cancelQueries({
        queryKey: applicationKeys.byAuthor(decided_by),
      });

      const prevData = qc.getQueryData<IApplyStatus[]>(
        applicationKeys.byAuthor(decided_by),
      );

      if (prevData) {
        qc.setQueryData(
          applicationKeys.byAuthor(decided_by),
          prevData.map(a => (a.id === id ? { ...a, status: 'accepted' } : a)),
        );
      }

      return { prevData, companion_id };
    },
    onSuccess: (_, { decided_by, companion_id }) => {
      qc.invalidateQueries({
        queryKey: applicationKeys.byCompanion(companion_id),
        refetchType: 'active',
      });
      qc.invalidateQueries({
        queryKey: applicationKeys.byAuthor(decided_by),
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

export const useRejectCompanion = () => {
  const qc = useQueryClient();

  return useMutation({
    ...applicationMutations.reject(),
    onMutate: async ({ decided_by, id, companion_id }) => {
      await qc.cancelQueries({
        queryKey: applicationKeys.byAuthor(decided_by),
      });

      const prevData = qc.getQueryData<IApplyStatus[]>(
        applicationKeys.byAuthor(decided_by),
      );

      if (prevData) {
        qc.setQueryData(
          applicationKeys.byAuthor(decided_by),
          prevData.map(a => (a.id === id ? { ...a, status: 'rejected' } : a)),
        );
      }

      return { prevData, companion_id };
    },
    onSuccess: (_, { decided_by, companion_id }) => {
      qc.invalidateQueries({
        queryKey: applicationKeys.byCompanion(companion_id),
        refetchType: 'active',
      });
      qc.invalidateQueries({
        queryKey: applicationKeys.byAuthor(decided_by),
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
