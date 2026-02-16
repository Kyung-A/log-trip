import { supabase } from "@/shared";

export const deleteS3Image = async (bucket: string, filePaths: string[]) => {
  try {
    return await supabase.storage.from(bucket).remove(filePaths);
  } catch (error) {
    console.error(error);
    return error;
  }
};
