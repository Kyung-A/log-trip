import { supabase } from "@/shared";
import { router, SplashScreen } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  useEffect(() => {
    const bootstrap = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          router.replace("/(tabs)");
        } else {
          router.replace("/(auth)/login");
        }
      } catch {
        router.replace("/(auth)/login");
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    bootstrap();
  }, []);

  return null;
}
