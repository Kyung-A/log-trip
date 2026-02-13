import { useQuery } from "@tanstack/react-query";

import { getMyCounter, getUser, getUserProfile } from "../api";
import { IMyCounters, IProfile } from "../types";

export const useFetchUserId = () => {
  return useQuery({
    queryKey: ["userId"],
    queryFn: () => getUser(),
    select: (id) => id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useFetchUserProfile = (userId?: string | null) => {
  return useQuery<IProfile>({
    queryKey: ["profile"],
    queryFn: () => getUserProfile(userId),
    enabled: !!userId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

export const useFetchMyCounter = (userId?: string | null) => {
  return useQuery<IMyCounters>({
    queryKey: ["myCounters"],
    queryFn: () => getMyCounter(userId),
    enabled: !!userId,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
