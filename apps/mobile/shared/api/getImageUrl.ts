import { supabase } from "@/shared";

export const getImageUrl = async (bucketName: string, path: string) => {
  try {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
