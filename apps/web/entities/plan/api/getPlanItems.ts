"use server";

import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared/lib/supabase";

import { IPlanItem } from "../types";

export const getPlanItems = async (planId: string): Promise<IPlanItem[]> => {
  const supabase = await createServerClient();

  const fetchPlanItems = unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("plan_items")
        .select("*")
        .eq("plan_id", planId)
        .order("day_number")
        .order("time");

      if (error) throw error;
      return data ?? [];
    },
    ["plan-items", planId],
    { tags: ["plan-items", `plan-items-${planId}`] },
  );

  return await fetchPlanItems();
};
