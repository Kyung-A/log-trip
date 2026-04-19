"use server";

import { createServerClient } from "@/shared/lib/supabase";

import { ICreatePlanInput, ITravelPlan } from "../types";

export const createPlan = async (
  input: ICreatePlanInput,
): Promise<ITravelPlan> => {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  const { data, error } = await supabase
    .from("travel_plans")
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
};
