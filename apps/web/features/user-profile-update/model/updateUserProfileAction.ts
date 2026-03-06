"use server";
import { revalidatePath, revalidateTag } from "next/cache";

import { IUpdateProfileData, updateUserProfile } from "@/entities/user";

export const updateUserProfileAction = async (data: IUpdateProfileData) => {
  try {
    const result = await updateUserProfile(data);

    revalidateTag("diaries", "default");
    revalidateTag(`diaries-${data.userId}`, "default");
    revalidateTag("public-diaries", "default");
    revalidateTag("user-profile", "default");
    revalidateTag(`user-profile-${data.userId}`, "default");

    revalidatePath("/public-diary");
    revalidatePath("/diary");
    revalidatePath("/mypage");
    revalidatePath(`/profile/${data.userId}`);

    return { success: true, result };
  } catch (e) {
    return { success: false, error: e };
  }
};
