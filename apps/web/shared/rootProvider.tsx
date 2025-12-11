"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from ".";

const queryClient = new QueryClient();

export default function RootProvider({ children }) {
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "SESSION") {
          const { accessToken, refreshToken } = data;

          supabase.auth
            .setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
            .then(({ error }) => {
              if (error) {
                console.error("세션 설정 오류:", error);
              } else {
                console.log(
                  "Supabase 세션이 웹뷰에 성공적으로 설정되었습니다."
                );
              }
            });
        }
      } catch (e) {
        console.error("메시지 처리 오류:", e);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
