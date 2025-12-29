export const companionsKeys = {
  all: ["companion"] as const,
  lists: () => [...companionsKeys.all, "list"] as const,
  list: (id: string) => [...companionsKeys.lists(), id] as const,
  details: () => [...companionsKeys.all, "detail"] as const,
  detail: (id: string) => [...companionsKeys.details(), id] as const,
};
