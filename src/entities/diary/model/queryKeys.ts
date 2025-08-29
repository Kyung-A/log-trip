export const diaryKeys = {
  all: ["diary"] as const,
  lists: () => [...diaryKeys.all, "list"] as const,
  list: (id: string) => [...diaryKeys.lists(), id] as const,
  details: () => [...diaryKeys.all, "detail"] as const,
  detail: (id: string) => [...diaryKeys.details(), id] as const,
};

export const diaryRegionKeys = {
  all: ["diaryRegions"] as const,
  byUser: (id: string) => [...diaryRegionKeys.all, id] as const,
};
