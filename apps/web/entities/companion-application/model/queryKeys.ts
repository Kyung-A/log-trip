import { statusType } from "../types";

export const applicationKeys = {
  all: ["companionApplication"] as const,
  byCompanion: (id: string) =>
    [...applicationKeys.all, "byCompanion", id] as const,
  mine: (userId?: string, status?: statusType) =>
    [...applicationKeys.all, "mine", userId, status] as const,
  byAuthor: (userId?: string, status?: statusType) =>
    [...applicationKeys.all, "byAuthor", userId, status] as const,
};
