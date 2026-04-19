"use server";

import { createServerClient } from "@/shared/lib/supabase";

export const deletePlanItem = async (id: string): Promise<void> => {
  const supabase = await createServerClient();
  const { error } = await supabase.from("plan_items").delete().eq("id", id);

  if (error) throw error;
};
