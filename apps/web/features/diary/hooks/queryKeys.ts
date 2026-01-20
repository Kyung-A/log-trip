import { InvalidateQueryFilters } from "@tanstack/react-query";

export const diaryKeys = {
  all: ["diary"] as const,
  mine: () => [...diaryKeys.all, "mine"] as const,
  feed: () => [...diaryKeys.all, "feed"] as const,
  detail: (id: string) => [...diaryKeys.all, "detail", id] as const,
};

export const diaryRegionKeys = {
  all: ["diaryRegions"] as const,
  byUser: (id?: string | null) =>
    [...diaryRegionKeys.all, "byUser", id] as const,
};

export const diaryInvalidateKeys = (
  userId: string,
): InvalidateQueryFilters[] => [
  { queryKey: ["myCounters"] },
  { queryKey: diaryKeys.mine() },
  { queryKey: diaryKeys.feed() },
  { queryKey: diaryRegionKeys.byUser(userId), exact: true },
  { queryKey: ["regions"] },
  { queryKey: ["regionGeo"] },
];
