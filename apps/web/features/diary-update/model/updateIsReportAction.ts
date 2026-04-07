"use server";
import { revalidatePath, revalidateTag } from "next/cache";

import { updateIsReport } from "@/entities/diary";

export const updateIsReportAction = async (id: string, userId: string) => {
  try {
    const result = await updateIsReport(id);

    revalidateTag("diaries", "default");
    revalidateTag(`diaries-${userId}`, "default");
    revalidateTag("public-diaries", "default");

    revalidatePath("/diary");

    return { success: true, result };
  } catch (e) {
    return { success: false, error: e };
  }
};
