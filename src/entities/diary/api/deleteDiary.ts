import { supabase } from "@/shared";
import { IDiary } from "../types";
import { deleteS3Image } from "@/shared";

const extractPathFromUrl = (url: string) => {
  const basePath = "log-trip-images/";
  const index = url.indexOf(basePath);
  return url.slice(index + basePath.length);
};

export const deleteDiary = async (data: IDiary) => {
  try {
    const response = await supabase.from("diaries").delete().eq("id", data.id);

    if (data.diary_images && data.diary_images.length > 0) {
      const filePath = data.diary_images.map((v) => extractPathFromUrl(v.url));
      await deleteS3Image("log-trip-images", filePath);
    }

    if (data.drawing_content) {
      const filePath = extractPathFromUrl(data.drawing_content);
      await deleteS3Image("log-trip-images", [filePath]);
    }

    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
