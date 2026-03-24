"use client";

import { useEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import { createClient, navigateNative } from "@/shared";

export const AuthBridgeClient = ({
  isAuthRequired,
}: {
  isAuthRequired: boolean;
}) => {
  const router = useRouter();
  const supabase = createClient();

  const lastSessionToken = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (isAuthRequired && window.ReactNativeWebView) {
      navigateNative("/(auth)", "NOT_SESSION");
      return;
    }

    const checkSessionSync = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentToken = session?.access_token ?? null;

      if (lastSessionToken.current === undefined) {
        lastSessionToken.current = currentToken;
        return;
      }

      if (currentToken !== lastSessionToken.current) {
        lastSessionToken.current = currentToken;

        if (!currentToken && isAuthRequired) {
          navigateNative("/(auth)", "NOT_SESSION");
        } else {
          router.refresh();
          console.log("🔄 세션 변경 감지: 서버 데이터를 갱신합니다.");
        }
      }
    };

    const handleFocus = () => {
      checkSessionSync();
    };

    window.addEventListener("focus", handleFocus);
    checkSessionSync();

    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthRequired, router, supabase.auth]);

  return null;
};
