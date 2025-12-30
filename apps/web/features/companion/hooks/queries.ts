import {
  queryOptions,
  useQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { companionsKeys } from "./queryKeys";
import { getCompanionDetail, getCompanions, ICompanion } from "..";

export const companionQueries = {
  list: () =>
    queryOptions<ICompanion[]>({
      queryKey: companionsKeys.lists(),
      queryFn: () => getCompanions(),
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }),

  detailClient: (postId: string) =>
    queryOptions<ICompanion>({
      queryKey: companionsKeys.detail(postId),
      queryFn: () => getCompanionDetail(postId),
      enabled: !!postId,
      refetchOnWindowFocus: true,
    }),

  detailServer: (postId: string) =>
    queryOptions<ICompanion>({
      queryKey: companionsKeys.detail(postId),
      queryFn: () => getCompanionDetail(postId),
    }),
};

export const useFetchCompanions = () => {
  return useSuspenseQuery({
    ...companionQueries.list(),
  });
};

export const useFetchCompanionDetail = (postId: string) => {
  return useQuery({
    ...companionQueries.detailClient(postId),
  });
};
