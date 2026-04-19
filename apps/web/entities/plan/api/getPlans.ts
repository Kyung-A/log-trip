"use server";

import { unstable_cache } from "next/cache";

import { createServerClient } from "@/shared/lib/supabase";

import { ITravelPlan } from "../types";

export const getPlans = async (): Promise<ITravelPlan[]> => {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const fetchPlans = unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("travel_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    ["plans", user.id],
    { tags: ["plans", `plans-${user.id}`] },
  );

  return await fetchPlans();
};
