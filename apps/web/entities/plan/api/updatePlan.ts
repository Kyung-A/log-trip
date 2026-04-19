"use server";

import { createServerClient } from "@/shared/lib/supabase";

import { ITravelPlan, IUpdatePlanInput } from "../types";

export const updatePlan = async (
  id: string,
  input: IUpdatePlanInput,
): Promise<ITravelPlan> => {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("travel_plans")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
