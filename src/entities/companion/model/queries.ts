import { queryOptions, useQuery } from '@tanstack/react-query';
import { companionsKeys } from './queryKeys';
import { getCompanionDetail, getCompanions } from '../api';
import { ICompanion } from './types';

const companionQueries = {
  list: () =>
    queryOptions({
      queryKey: companionsKeys.lists(),
      queryFn: () => getCompanions(),
      staleTime: 10_000,
    }),

  detail: (postId: string) =>
    queryOptions({
      queryKey: companionsKeys.detail(postId),
      queryFn: () => getCompanionDetail(postId),
    }),
};

export const useFetchCompanions = () => {
  return useQuery<ICompanion[]>({
    ...companionQueries.list(),
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};

export const useFetchCompanionDetail = (postId: string) => {
  return useQuery<ICompanion>({
    ...companionQueries.detail(postId),
    enabled: !!postId,
    refetchOnWindowFocus: true,
  });
};
