import { Suspense } from "react";

import { AuthLayout } from "@/widgets/auth";

import Loading from "./loading";

export default function PublicDiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </AuthLayout>
  );
}
