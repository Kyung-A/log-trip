"use server";

import { getPublicDiaries } from "@/entities/diary";

export async function getPublicDiariesAction(page: number) {
  return await getPublicDiaries(page, 10);
}
