"use server";

import { createServerClient } from "@/shared/lib/supabase";

import { ITravelPlan } from "../types";
import { MOCK_PLANS } from "./mockData";

export const getPlan = async (id: string): Promise<ITravelPlan | null> => {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("travel_plans")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch {
    return MOCK_PLANS.find((p) => p.id === id) ?? MOCK_PLANS[0];
  }
};
