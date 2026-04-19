"use server";

import { createServerClient } from "@/shared/lib/supabase";

import { IPlanItem } from "../types";
import { MOCK_PLAN_ITEMS } from "./mockData";

export const getPlanItems = async (planId: string): Promise<IPlanItem[]> => {
  try {
    const supabase = await createServerClient();
    const { data, error } = await supabase
      .from("plan_items")
      .select("*")
      .eq("plan_id", planId)
      .order("day_number")
      .order("time");

    if (error) throw error;
    return data ?? [];
  } catch {
    return MOCK_PLAN_ITEMS.filter((item) => item.plan_id === planId);
  }
};
