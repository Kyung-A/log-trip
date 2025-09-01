import { queryOptions, useQuery } from '@tanstack/react-query';
import { applicationKeys } from './queryKeys';
import { getMyApplyStatus } from '../api/getMyApplyStatus';
import { IApplyStatus, status } from './types';

const applicationQuery = {
  mine: (status?: status) =>
    queryOptions({
      queryKey: applicationKeys.mine(status),
      queryFn: () => getMyApplyStatus(status),
    }),
};

export const useMyApplyStatus = (status?: status) => {
  return useQuery<IApplyStatus[]>({
    ...applicationQuery.mine(status),
    placeholderData: prev => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
