import { Suspense } from "react";
import Loading from "./loading";

export default function CompanionLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
      {modal}
    </Suspense>
  );
}
