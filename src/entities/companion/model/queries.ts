import { queryOptions, useQuery } from '@tanstack/react-query';
import { companionsKeys } from './queryKeys';
import { getCompanions } from '../api';
import { ICompanion } from './types';

const companionQueries = {
  list: () =>
    queryOptions({
      queryKey: companionsKeys.lists(),
      queryFn: () => getCompanions(),
      staleTime: 10_000,
    }),
};

export const useFetchCompanions = () => {
  return useQuery<ICompanion[]>({
    ...companionQueries.list(),
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};
