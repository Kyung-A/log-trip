"use server";
import { revalidateTag } from "next/cache";

import { updateIsPublic } from "@/entities/diary";

export const toggleVisibilityAction = async (
  id: string,
  state: boolean,
  userId?: string,
) => {
  try {
    const result = await updateIsPublic(id, state);

    revalidateTag("diaries", "default");
    revalidateTag(`diaries-${userId}`, "default");
    // TODO: 일기숲도 초기화 필요

    return { success: true, result };
  } catch (e) {
    return { success: false, error: e };
  }
};
