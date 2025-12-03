import { useQuery } from '@tanstack/react-query';
import { getMyCounter } from '../api';
import { IMyCounters } from './types';

export const useFetchMyCounter = (userId: string) => {
  return useQuery<IMyCounters>({
    queryKey: ['myCounters'],
    queryFn: () => getMyCounter(userId),
    enabled: !!userId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
