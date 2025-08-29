import { queryOptions, useQuery } from "@tanstack/react-query";
import { getDiaries, getDiaryRegions } from "../api";
import { IDiary, IDiaryRegions } from ".";
import { diaryKeys, diaryRegionKeys } from "./queryKeys";

const diaryQueries = {
  list: (userId: string) =>
    queryOptions<IDiary[]>({
      queryKey: diaryKeys.list(userId),
      queryFn: () => getDiaries(userId),
      staleTime: Infinity,
    }),

  regions: (userId: string) =>
    queryOptions<IDiaryRegions[]>({
      queryKey: diaryRegionKeys.byUser(userId),
      queryFn: () => getDiaryRegions(userId),
      staleTime: Infinity,
    }),
};

export const useFetchDiaries = (userId: string | null | undefined) => {
  return useQuery({
    ...diaryQueries.list(userId),
    enabled: !!userId,
    placeholderData: (prev) => prev,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useFetchDiaryRegions = (userId: string | null | undefined) => {
  return useQuery({
    ...diaryQueries.regions(userId),
    placeholderData: (prev) => prev,
    enabled: !!userId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
