import { supabase } from "@/shared";
import { IApply } from "../types";

export const apply = async (data: IApply) => {
  const { status, error } = await supabase
    .from("companion_applications")
    .upsert(
      {
        ...data,
        status: "pending",
      },
      { onConflict: "companion_id,applicant_id" }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return status;
};
