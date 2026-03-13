import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import NitroCookies from "react-native-nitro-cookies";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const setSupabaseCookie = async (session: any) => {
  const url = process.env.EXPO_PUBLIC_WEBVIEW_URL as string;
  const projectId = process.env.EXPO_PUBLIC_SUPABASE_ID as string;
  const cookieName = `sb-${projectId}-auth-token`;

  try {
    const jsonString = JSON.stringify(session);
    const cookieValue = encodeURIComponent(jsonString);

    await NitroCookies.set(url, {
      name: cookieName,
      value: cookieValue,
      path: "/",
      secure: false, // TODO: http 환경이므로 false
      httpOnly: false, // TODO: SDK가 읽어야 하므로 false
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString(),
    });
  } catch (e) {
    console.error("❌ 쿠키 주입 에러:", e);
  }
};
