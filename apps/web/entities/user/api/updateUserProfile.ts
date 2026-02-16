import { supabase } from "@/shared";

import { IUpdateProfileData } from "../types";

export const updateUserProfile = async (data: IUpdateProfileData) => {
  const { status, error } = await supabase
    .from("users")
    .update(data)
    .eq("id", data.userId)
    .select();

  if (error) throw Error(error.message);

  return status;
};
