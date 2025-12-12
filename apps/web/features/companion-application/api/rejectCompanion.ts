import { supabase } from "@/shared";
import { IRejectCompanion } from "../hooks";

export const rejectCompanion = async (data: IRejectCompanion) => {
  const { companion_id, ...body } = data;

  try {
    const response = await supabase
      .from("companion_applications")
      .update({ ...body, status: "rejected" })
      .in("status", ["pending"])
      .eq("id", body.id);

    return response;
  } catch (e) {
    console.error(e);
    return e;
  }
};
