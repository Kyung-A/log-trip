"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { createDiary, IDiary } from "@/entities/diary";

export const createDiaryAction = async (data: IDiary) => {
  try {
    const result = await createDiary(data);

    revalidateTag("diaries", "default");
    revalidateTag(`diaries-${data.user_id}`, "default");
    revalidateTag("diary-regions", "default");
    revalidateTag(`diary-regions-${data.user_id}`, "default");
    revalidateTag("all-regions", "default");
    revalidateTag("geojson-data", "default");
    revalidateTag("public-diaries", "default");
    revalidateTag("user-diary-counter", "default");
    revalidateTag(`user-diary-counter-${data.user_id}`, "default");

    revalidatePath("/mypage");
    revalidatePath(`/profile/${data.user_id}`);
    revalidatePath("/public-diary");
    revalidatePath("/world-map");
    revalidatePath("/diary");

    return { success: true, result: result };
  } catch (e) {
    return { success: false, error: e };
  }
};
