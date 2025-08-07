import { supabase } from "@/lib";

export const deleteS3Image = async (bucket: string, filePaths: string[]) => {
  try {
    console.log(filePaths);
    return await supabase.storage.from(bucket).remove(filePaths);
  } catch (error) {
    console.error(error);
    return error;
  }
};
