import { createClient } from "@/shared";

export const updateIsReport = async (id: string) => {
  const supabase = createClient();

  const { status, error } = await supabase
    .from("diaries")
    .update({ is_report: true })
    .eq("id", id);

  if (error) throw error.message;

  return status;
};
