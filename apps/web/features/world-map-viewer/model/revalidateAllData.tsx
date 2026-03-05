"use server";
import { revalidateTag } from "next/cache";

export const revalidateAllData = async (userId?: string) => {
  revalidateTag("all-regions", "default");
  revalidateTag("geojson", "default");
  revalidateTag("diary-regions", "default");

  if (userId) {
    revalidateTag(`diary-regions-${userId}`, "default");
  }
};
