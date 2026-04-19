"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { updatePlanItem, IUpdatePlanItemInput } from "@/entities/plan";

export const updatePlanItemAction = async (
  id: string,
  planId: string,
  input: IUpdatePlanItemInput,
): Promise<{ success: boolean; error?: string }> => {
  try {
    await updatePlanItem(id, input);
    revalidateTag(`plan-items-${planId}`, "default");
    revalidatePath(`/plan/${planId}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : String(e) };
  }
};
