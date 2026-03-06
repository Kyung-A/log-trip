import { createClient } from "@/shared";

export const getImageUrl = (bucketName: string, path: string) => {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data;
};
