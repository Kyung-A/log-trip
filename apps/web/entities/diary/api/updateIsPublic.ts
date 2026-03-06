import { createServerClient } from "@/shared";

export const updateIsPublic = async (id: string, state: boolean) => {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("diaries")
    .update({ is_public: state })
    .eq("id", id);

  if (error) throw new Error(error.message);
  return;
};
