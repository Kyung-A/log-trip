"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const qc = new QueryClient();

  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
