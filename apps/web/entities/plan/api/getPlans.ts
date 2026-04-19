"use server";

import { createServerClient } from "@/shared/lib/supabase";

import { ITravelPlan } from "../types";
import { MOCK_PLANS } from "./mockData";

export const getPlans = async (): Promise<ITravelPlan[]> => {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("travel_plans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch {
    return MOCK_PLANS;
  }
};
