import { status } from "../types";

export const applicationKeys = {
  all: ["companionApplication"] as const,
  byCompanion: (id: string) =>
    [...applicationKeys.all, "byCompanion", id] as const,
  mine: (userId?: string, status?: status) =>
    [...applicationKeys.all, "mine", userId, status] as const,
  byAuthor: (userId?: string, status?: status) =>
    [...applicationKeys.all, "byAuthor", userId, status] as const,
};
