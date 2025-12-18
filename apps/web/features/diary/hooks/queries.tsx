import { queryOptions, useQuery } from "@tanstack/react-query";
import { diaryKeys, diaryRegionKeys } from "./queryKeys";
import { IDiary, IDiaryRegions } from ".";
import { getDiaries, getDiaryRegions } from "../apis";

const diaryQueries = {
  list: () =>
    queryOptions<IDiary[]>({
      queryKey: diaryKeys.list(),
      queryFn: () => getDiaries(),
      staleTime: Infinity,
    }),

  regions: (userId: string | null) =>
    queryOptions<IDiaryRegions[]>({
      queryKey: diaryRegionKeys.byUser(userId),
      queryFn: () => getDiaryRegions(userId),
      staleTime: Infinity,
    }),
};

export const useFetchDiaries = () => {
  return useQuery({
    ...diaryQueries.list(),
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useFetchDiaryRegions = (userId: string | null) => {
  return useQuery({
    ...diaryQueries.regions(userId),
    placeholderData: (prev) => prev,
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
