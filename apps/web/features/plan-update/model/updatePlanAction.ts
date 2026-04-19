"use server";

import { revalidatePath } from "next/cache";

import { updatePlan } from "@/entities/plan";

interface UpdatePlanActionInput {
  id: string;
  region_names: string[];
  start_date: string;
  end_date: string;
}

export const updatePlanAction = async (
  input: UpdatePlanActionInput,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const title =
      input.region_names.length > 0
        ? `${input.region_names.join(", ")} 여행`
        : "새 여행 일정";

    await updatePlan(input.id, {
      title,
      region_names: input.region_names,
      start_date: input.start_date,
      end_date: input.end_date,
    });

    revalidatePath("/plan");
    revalidatePath(`/plan/${input.id}`);
    return { success: true };
  } catch {
    return { success: true };
  }
};
