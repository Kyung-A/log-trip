import { supabase } from "@/shared";

export const deleteCompanion = async (id: string) => {
  await supabase.from("companion_regions").delete().eq("companion_id", id);
  const { status, error } = await supabase
    .from("companions")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);

  return status;
};
