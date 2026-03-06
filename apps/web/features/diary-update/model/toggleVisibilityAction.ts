"use server";
import { revalidatePath, revalidateTag } from "next/cache";

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
    revalidateTag("public-diaries", "default");
    revalidateTag("user-diary-counter", "default");
    revalidateTag(`user-diary-counter-${userId}`, "default");

    revalidatePath("/mypage");
    revalidatePath(`/profile/${userId}`);
    revalidatePath("/public-diary");

    return { success: true, result };
  } catch (e) {
    return { success: false, error: e };
  }
};
