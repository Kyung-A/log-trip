"use server";

import { createServerClient } from "@/shared/lib/supabase";

import { ICreatePlanItemInput, IPlanItem } from "../types";

export const createPlanItem = async (
  input: ICreatePlanItemInput,
): Promise<IPlanItem> => {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("plan_items")
    .insert(input)
    .select()
    .single();

  if (error) throw error;
  return data;
};
