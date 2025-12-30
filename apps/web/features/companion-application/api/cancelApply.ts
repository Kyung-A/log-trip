import { supabase } from "@/shared";
import { IApplyStatus } from "../types";

export const cancelApply = async (data: IApplyStatus) => {
  try {
    const response = await supabase
      .from("companion_applications")
      .update({ status: "cancelled" })
      .in("status", ["pending", "accepted"])
      .eq("id", data.id);

    return response;
  } catch (e) {
    console.error(e);
    return e;
  }
};
