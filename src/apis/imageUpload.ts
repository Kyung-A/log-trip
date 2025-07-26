import { supabase } from "@/lib/supabase";

export const imageUpload = async (
  bucketName: string,
  filePath: string,
  imageBlob: any
) => {
  try {
    const { data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, imageBlob, {
        contentType: "image/jpeg",
        upsert: true,
      });
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
