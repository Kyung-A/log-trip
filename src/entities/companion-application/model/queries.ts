import { queryOptions, useQuery } from '@tanstack/react-query';
import { applicationKeys } from './queryKeys';
import { IApplyStatus, status } from './types';
import { getMyApplyStatus } from '../api';

const applicationQuery = {
  mine: (userId: string, status?: status) =>
    queryOptions({
      queryKey: applicationKeys.mine(userId, status),
      queryFn: () => getMyApplyStatus(userId, status),
    }),
};

export const useMyApplyStatus = (userId: string, status?: status) => {
  return useQuery<IApplyStatus[]>({
    ...applicationQuery.mine(userId, status),
    enabled: !!userId,
    placeholderData: prev => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
