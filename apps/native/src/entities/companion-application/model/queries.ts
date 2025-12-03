import { queryOptions, useQuery } from '@tanstack/react-query';
import { applicationKeys } from './queryKeys';
import { IApplicantsForMyPost, IApplyStatus, status } from './types';
import { getApplicantsForMyPosts, getMyApplyStatus } from '../api';

const applicationQuery = {
  mine: (userId: string, status?: status) =>
    queryOptions({
      queryKey: applicationKeys.mine(userId, status),
      queryFn: () => getMyApplyStatus(userId, status),
    }),

  byAuthor: (userId: string, status?: status) =>
    queryOptions({
      queryKey: applicationKeys.byAuthor(userId, status),
      queryFn: () => getApplicantsForMyPosts(userId, status),
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

export function useApplicantsForMyPosts(userId: string, status?: status) {
  return useQuery<IApplicantsForMyPost[]>({
    ...applicationQuery.byAuthor(userId, status),
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });
}
