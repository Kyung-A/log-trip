"use server";

import { revalidatePath } from "next/cache";

import { createPlanItem, ICreatePlanItemInput } from "@/entities/plan";

export const createPlanItemAction = async (
  input: ICreatePlanItemInput,
): Promise<{ success: boolean; error?: string }> => {
  try {
    await createPlanItem(input);
    revalidatePath(`/plan/${input.plan_id}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : String(e) };
  }
};
