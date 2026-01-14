/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from ".";

const queryClient = new QueryClient();

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSettingSession = useRef(false);

  useEffect(() => {
    const handleMessage = async (event: { data: string }) => {
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data.type === "SESSION") {
          isSettingSession.current = true;
          const { accessToken, refreshToken } = data;

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("세션 설정 오류:", error.message);
            (window as any).ReactNativeWebView?.postMessage(
              JSON.stringify({ type: "LOGOUT_REQUIRED" })
            );
          }
          isSettingSession.current = false;
        }
      } catch (e) {
        console.error("메시지 처리 오류:", e);
        isSettingSession.current = false;
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (isSettingSession.current) return;

      const isLoggedOut = event === "SIGNED_OUT" || !session;
      if (isLoggedOut) {
        (window as any).ReactNativeWebView?.postMessage(
          JSON.stringify({ type: "LOGOUT_REQUIRED" })
        );
        return;
      }

      if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error || !user) {
          (window as any).ReactNativeWebView?.postMessage(
            JSON.stringify({ type: "LOGOUT_REQUIRED" })
          );
        }
      }
    });

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      subscription.unsubscribe();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
