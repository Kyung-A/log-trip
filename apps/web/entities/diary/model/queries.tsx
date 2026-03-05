import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { getDiaries, getPublicDiaries } from "..";
import { diaryKeys } from "./queryKeys";
import { IDiary } from "../types";

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
