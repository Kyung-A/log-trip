"use server";

import { createServerClient } from "@/shared/lib/supabase";

export const deletePlan = async (id: string): Promise<void> => {
  const supabase = await createServerClient();
  const { error } = await supabase
    .from("travel_plans")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
