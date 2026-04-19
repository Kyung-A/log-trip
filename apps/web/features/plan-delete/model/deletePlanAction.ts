"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { deletePlan } from "@/entities/plan";

export const deletePlanAction = async (
  id: string,
): Promise<{ success: boolean }> => {
  try {
    await deletePlan(id);
    revalidateTag("plans", "default");
    revalidateTag("plan-items", "default");
    revalidatePath("/plan");
    return { success: true };
  } catch {
    return { success: false };
  }
};
