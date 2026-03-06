import { useQuery } from "@tanstack/react-query";

import { getUser } from "../api";

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
