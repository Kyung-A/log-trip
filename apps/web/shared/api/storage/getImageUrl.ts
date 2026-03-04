import { createServerClient } from "@/shared";

export const getImageUrl = async (bucketName: string, path: string) => {
  const supabase = await createServerClient();

  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data;
};
