import { useQuery } from "@tanstack/react-query";
import { getRegions } from "../api";
import { IRegion } from ".";

export const useFetchRegions = (filters?: string) => {
  return useQuery<IRegion[], Error>({
    queryKey: ["regions", filters],
    queryFn: () => getRegions(filters),
    staleTime: 24 * 60 * 60 * 1000,
  });
};
