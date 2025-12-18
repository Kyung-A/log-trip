"use client";

import { supabase } from "@/shared";
import { useEffect } from "react";
import WorldMap from "./WorldMap";

export default function WorldMapPage() {
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "SESSION") {
          supabase.auth.setSession({
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
          });
        }
      } catch (e) {
        console.warn("Invalid message", e);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <WorldMap />;
}
