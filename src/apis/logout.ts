import { supabase } from "@/lib";

export const logout = async () => {
  await supabase.auth.signOut();
};
