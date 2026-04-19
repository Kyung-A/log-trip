"use server";

import { revalidatePath } from "next/cache";

import { createPlan } from "@/entities/plan";

interface CreatePlanActionInput {
  region_names: string[];
  start_date: string;
  end_date: string;
}

export const createPlanAction = async (
  input: CreatePlanActionInput,
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const title =
      input.region_names.length > 0
        ? `${input.region_names.join(", ")} 여행`
        : "새 여행 일정";

    const plan = await createPlan({
      title,
      region_names: input.region_names,
      start_date: input.start_date,
      end_date: input.end_date,
    });

    revalidatePath("/plan");
    return { success: true, id: plan.id };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : String(e) };
  }
};
