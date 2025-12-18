import { supabase } from "@/shared";

export const getUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (e) {
    console.error(e);
    return e;
  }
};
