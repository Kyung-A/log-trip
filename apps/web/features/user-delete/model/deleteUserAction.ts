"use server";

import { revalidatePath } from "next/cache";

import { deleteUser } from "@/entities/user";

export const deleteUserAction = async (id?: string, platform?: string) => {
  try {
    await deleteUser(id, platform);
    revalidatePath("/", "layout");

    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
};
