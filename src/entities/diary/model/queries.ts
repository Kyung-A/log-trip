import { useQuery } from "@tanstack/react-query";
import { getDiaryRegions } from "../api";
import { IDiaryRegions } from ".";

export const useFetchDiaryRegions = (id: string | null | undefined) => {
  const enabled = typeof id === "string" && id.length > 0;

  return useQuery<IDiaryRegions[], Error>({
    queryKey: ["diaryRegions", id],
    queryFn: () => getDiaryRegions(id),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    enabled,
    placeholderData: (prev) => prev,
  });
};
