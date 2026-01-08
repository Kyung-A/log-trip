import { CompanionApplyModal } from "@/features/companion-application";
import { Suspense } from "react";

export default function CompanionApply() {
  return (
    <Suspense fallback={null}>
      <CompanionApplyModal />
    </Suspense>
  );
}
