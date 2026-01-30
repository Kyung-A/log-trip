/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from ".";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const [isReady, setIsReady] = useState(false);
  const isSettingSession = useRef(false);

  useEffect(() => {
    const handleMessage = async (event: any) => {
      let data;
      try {
        data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch (e) {
        return;
      }

      if (data?.type === "SESSION") {
        isSettingSession.current = true;
        const { accessToken, refreshToken } = data;

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("세션 주입 실패:", error.message);
          (window as any).ReactNativeWebView?.postMessage(
            JSON.stringify({ type: "LOGOUT_REQUIRED" }),
          );
        } else {
          // 세션 주입 성공 시 쿼리 초기화
          await queryClient.invalidateQueries();
          setIsReady(true); // ★ 세션 주입 성공 시점에만 true로 변경
        }
        isSettingSession.current = false;
      }
    };

    // 안전장치: 앱에서 메시지가 안 오더라도 기존 로컬 세션이 있다면 진행
    const safetyTimer = setTimeout(() => {
      // 이미 세션 주입에 성공해서 준비가 끝났다면 아무것도 하지 않음
      if (isReady) return;

      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setIsReady(true);
        } else {
          // 2초가 지났는데 로컬 세션도 없고, 앱에서도 SESSION 메시지가 아직 안 왔을 때만 실행
          console.warn("2초간 세션 확인 불가: 로그아웃 요청 전송");
          (window as any).ReactNativeWebView?.postMessage(
            JSON.stringify({ type: "LOGOUT_REQUIRED" }),
          );
        }
      });
    }, 3000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // 1. 세션 설정 중일 때는 로그아웃 체크 무시
      if (isSettingSession.current) return;

      // 2. 중요: 아직 세션 주입 시도가 완료되지 않았다면(isReady가 false라면)
      //    SIGNED_OUT 이벤트가 발생해도 로그아웃 처리하지 않음 (첫 진입 시 튕김 방지)
      if (!isReady && (event === "SIGNED_OUT" || !session)) {
        console.log("세션 주입 대기 중... 로그아웃 체크 유예");
        return;
      }

      // 3. 세션이 완전히 없는 경우 (이미 주입 시도가 끝난 후라면 진짜 로그아웃임)
      if (event === "SIGNED_OUT" && !session) {
        (window as any).ReactNativeWebView?.postMessage(
          JSON.stringify({ type: "LOGOUT_REQUIRED" }),
        );
        return;
      }
    });

    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
      subscription.unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, [queryClient, isReady]); // isReady를 의존성에 추가하여 상태 변화 감지

  return (
    <QueryClientProvider client={queryClient}>
      {isReady ? (
        <>{children}</>
      ) : (
        <div className="flex items-center justify-center h-screen bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#d5b2a8]" />
        </div>
      )}
    </QueryClientProvider>
  );
}
