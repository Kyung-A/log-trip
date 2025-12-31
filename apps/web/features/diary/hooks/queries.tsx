import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { diaryKeys, diaryRegionKeys } from "./queryKeys";
import { getDiaries, getDiaryRegions, getPublicDiaries } from "../apis";
import { IDiary, IDiaryRegions } from "../types";

export const diaryQueries = {
  mineList: () =>
    queryOptions<IDiary[]>({
      queryKey: diaryKeys.mine(),
      queryFn: () => getDiaries(),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: Infinity,
    }),

  feedList: () =>
    queryOptions<IDiary[]>({
      queryKey: diaryKeys.feed(),
      queryFn: () => getPublicDiaries(),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
      staleTime: Infinity,
    }),

  regions: (userId?: string | null) =>
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

export const useFetchDiaries = (queryKey: readonly unknown[]) => {
  const keyStr = JSON.stringify(queryKey);

  let options;
  if (keyStr === JSON.stringify(diaryKeys.mine())) {
    options = diaryQueries.mineList();
  } else if (keyStr === JSON.stringify(diaryKeys.feed())) {
    options = diaryQueries.feedList();
  } else {
    options = { queryKey };
  }

  return useSuspenseQuery({
    ...options,
  });
};

export const useFetchDiaryRegions = (userId?: string | null) => {
  return useQuery({
    ...diaryQueries.regions(userId),
  });
};
