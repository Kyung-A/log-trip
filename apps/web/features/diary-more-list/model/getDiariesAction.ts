"use server";

import { getDiaries } from "@/entities/diary";

export async function getDiariesAction(page: number, userId?: string) {
  return await getDiaries(userId, page, 10);
}
