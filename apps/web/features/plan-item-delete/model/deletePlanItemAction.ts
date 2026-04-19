"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { deletePlanItem } from "@/entities/plan";

export const deletePlanItemAction = async (
  id: string,
  planId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    await deletePlanItem(id);
    revalidateTag(`plan-items-${planId}`, "default");
    revalidatePath(`/plan/${planId}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : String(e) };
  }
};
