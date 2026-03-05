"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { deleteDiary, IDiary } from "@/entities/diary";

export const deleteDiaryAction = async (data: IDiary) => {
  try {
    const result = await deleteDiary(data);

    revalidateTag("diaries", "default");
    revalidateTag(`diaries-${data.user_id}`, "default");
    revalidateTag("diary-regions", "default");
    revalidateTag(`diary-regions-${data.user_id}`, "default");
    revalidateTag("all-regions", "default");
    revalidateTag("geojson-data", "default");

    revalidatePath("/world-map");
    revalidatePath("/diary");
    // TODO: 일기숲도 초기화 필요

    return { success: true, result: result };
  } catch (e) {
    return { success: false, error: e };
  }
};
