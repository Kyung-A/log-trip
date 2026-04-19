"use server";

import { revalidatePath } from "next/cache";

import { deletePlan } from "@/entities/plan";

export const deletePlanAction = async (
  id: string,
): Promise<{ success: boolean }> => {
  try {
    await deletePlan(id);
    revalidatePath("/plan");
    return { success: true };
  } catch {
    return { success: false };
  }
};
