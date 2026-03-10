import { Suspense } from "react";

import { CompanionApplyModal } from "@/features/companion-application";

export default function CompanionApply() {
  return (
    <Suspense fallback={null}>
      <CompanionApplyModal />
    </Suspense>
  );
}
