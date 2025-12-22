import { InvalidateQueryFilters } from "@tanstack/react-query";

export const diaryKeys = {
  all: ["diary"] as const,
  lists: () => [...diaryKeys.all, "lists"] as const,
  list: () => [...diaryKeys.lists(), "list"] as const,
  details: () => [...diaryKeys.all, "detail"] as const,
  detail: (id: string) => [...diaryKeys.details(), id] as const,
};

export const diaryRegionKeys = {
  all: ["diaryRegions"] as const,
  byUser: (id: string) => [...diaryRegionKeys.all, id] as const,
};

export const diaryInvalidateKeys = (
  userId: string
): InvalidateQueryFilters[] => [
  { queryKey: ["myCounters"] },
  { queryKey: diaryKeys.list() },
  { queryKey: diaryRegionKeys.byUser(userId), exact: true },
  { queryKey: ["regions"] },
  { queryKey: ["regionGeo"] },
];
