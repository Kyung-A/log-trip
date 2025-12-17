import { supabase } from "@/shared";

export const logout = async () => {
  await supabase.auth.signOut();
};
