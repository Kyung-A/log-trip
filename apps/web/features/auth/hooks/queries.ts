import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api";
import { IProfile } from "./types";

export const useFetchUserId = () => {
  return useQuery({
    queryKey: ["userId"],
    queryFn: getUser,
    select: (user) => user?.id ?? null,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};

// export const useFetchUserProfile = (userId: string) => {
//   return useQuery<IProfile>({
//     queryKey: ['profile'],
//     queryFn: () => getUserProfile(userId),
//     enabled: !!userId,
//     staleTime: Infinity,
//     gcTime: Infinity,
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     refetchOnMount: false,
//   });
// };
