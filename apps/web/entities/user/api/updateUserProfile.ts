import { createClient } from "@/shared";

import { IUpdateProfileData } from "../types";

export const updateUserProfile = async (data: IUpdateProfileData) => {
  const supabase = createClient();

  const { userId, ...updateData } = data;

  const { status, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", userId)
    .select();

  if (error) throw Error(error.message);

  return status;
};
