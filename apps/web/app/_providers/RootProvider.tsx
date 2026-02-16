"use client";

import { useState } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useAuthBridge } from "@/shared";
import { SplashScreen } from "@/widgets/splash-screen";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());
  const { isReady } = useAuthBridge(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {isReady ? <>{children}</> : <SplashScreen />}
    </QueryClientProvider>
  );
}
