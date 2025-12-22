import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { diaryKeys, diaryRegionKeys } from "./queryKeys";
import { getDiaries, getDiaryRegions } from "../apis";
import { IDiary, IDiaryRegions } from "../types";

const diaryQueries = {
  list: () =>
    queryOptions<IDiary[]>({
      queryKey: diaryKeys.list(),
      queryFn: () => getDiaries(),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: Infinity,
    }),

  regions: (userId: string) =>
    queryOptions<IDiaryRegions[] | null>({
      queryKey: diaryRegionKeys.byUser(userId),
      queryFn: () => getDiaryRegions(userId),
      placeholderData: (prev) => prev,
      enabled: !!userId,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: Infinity,
    }),
};

export const useFetchDiaries = () => {
  return useSuspenseQuery({
    ...diaryQueries.list(),
  });
};

export const useFetchDiaryRegions = (userId: string) => {
  return useQuery({
    ...diaryQueries.regions(userId),
  });
};
