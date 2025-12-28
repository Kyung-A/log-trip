import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { companionsKeys } from "./queryKeys";
import { getCompanionDetail, getCompanions, ICompanion } from "..";

const companionQueries = {
  list: () =>
    queryOptions<ICompanion[]>({
      queryKey: companionsKeys.lists(),
      queryFn: () => getCompanions(),
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }),

  detail: (postId: string) =>
    queryOptions({
      queryKey: companionsKeys.detail(postId),
      queryFn: () => getCompanionDetail(postId),
      // enabled: !!postId,
      refetchOnWindowFocus: true,
    }),
};

export const useFetchCompanions = () => {
  return useSuspenseQuery({
    ...companionQueries.list(),
  });
};

export const useFetchCompanionDetail = (postId: string) => {
  return useSuspenseQuery({
    ...companionQueries.detail(postId),
  });
};
