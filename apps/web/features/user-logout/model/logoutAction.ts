"use server";
import { revalidatePath } from "next/cache";

import { createServerClient } from "@/shared";

export const logoutAction = async () => {
  try {
    const supabase = await createServerClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");

    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
};
