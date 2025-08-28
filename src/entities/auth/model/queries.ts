import { useQuery } from "@tanstack/react-query";
import { getUser } from "../api";

export const useFetchUserId = () => {
  return useQuery({
    queryKey: ["userId"],
    queryFn: getUser,
    select: (user) => user.id ?? null,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
};
