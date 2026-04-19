"use server";

import { createServerClient } from "@/shared/lib/supabase";

import { IPlanItem, IUpdatePlanItemInput } from "../types";

export const updatePlanItem = async (
  id: string,
  input: IUpdatePlanItemInput,
): Promise<IPlanItem> => {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("plan_items")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};
