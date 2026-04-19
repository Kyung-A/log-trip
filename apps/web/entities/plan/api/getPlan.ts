"use server";

import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared/lib/supabase";

import { ITravelPlan } from "../types";

export const getPlan = async (id: string): Promise<ITravelPlan | null> => {
  const supabase = await createServerClient();

  const fetchPlan = unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("travel_plans")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    ["plan", id],
    { tags: ["plans", `plan-${id}`] },
  );

  return await fetchPlan();
};
