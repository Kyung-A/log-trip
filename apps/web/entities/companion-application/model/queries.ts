import { queryOptions, useQuery } from "@tanstack/react-query";

import { IApplicantsForMyPost, IApplyStatus, statusType } from "..";
import { applicationKeys } from "./queryKeys";
import { getApplicantsForMyPosts, getMyApplyStatus } from "../api";

const applicationQuery = {
  mine: (userId?: string, status?: statusType) =>
    queryOptions<IApplyStatus[]>({
      queryKey: applicationKeys.mine(userId, status),
      queryFn: () => getMyApplyStatus(userId, status),
      enabled: !!userId,
      placeholderData: (prev) => prev,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    }),

  byAuthor: (userId?: string, status?: statusType) =>
    queryOptions<IApplicantsForMyPost[]>({
      queryKey: applicationKeys.byAuthor(userId, status),
      queryFn: () => getApplicantsForMyPosts(userId, status),
      enabled: !!userId,
      refetchOnWindowFocus: true,
    }),
};

export const useMyApplyStatus = (userId?: string, status?: statusType) => {
  return useQuery({
    ...applicationQuery.mine(userId, status),
  });
};

export function useApplicantsForMyPosts(userId?: string, status?: statusType) {
  return useQuery({
    ...applicationQuery.byAuthor(userId, status),
  });
}
