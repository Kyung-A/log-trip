import { supabase } from "@/shared";
import { IAcceptCompanion } from "../types";

export const acceptCompanion = async (data: IAcceptCompanion) => {
  const { companion_id, ...body } = data;

  const { status, error } = await supabase
    .from("companion_applications")
    .update({ ...body, status: "accepted" })
    .in("status", ["pending"])
    .eq("id", body.id);

  if (error) throw new Error(error.message);

  return status;
};
