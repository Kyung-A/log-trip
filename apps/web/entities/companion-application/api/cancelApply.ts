import { createClient } from "@/shared";

import { IApplyStatus } from "..";

export const cancelApply = async (data: IApplyStatus) => {
  const supabase = createClient();

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
