import { createClient } from "@/shared";

import { IRejectCompanion } from "..";

export const rejectCompanion = async (data: IRejectCompanion) => {
  const supabase = createClient();

  // eslint-disable-next-line unused-imports/no-unused-vars
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
