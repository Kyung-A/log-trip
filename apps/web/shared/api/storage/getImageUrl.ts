import { supabase } from "@/shared";

export const getImageUrl = (bucketName: string, path: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data;
};
