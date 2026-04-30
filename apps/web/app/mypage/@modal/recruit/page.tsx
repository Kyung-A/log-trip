import { Suspense } from "react";

import { CompanionRecruitAcceptModal } from "@/features/companion-application";

export default function CompanionRecruitAccept() {
  return (
    <Suspense fallback={null}>
      <CompanionRecruitAcceptModal />
    </Suspense>
  );
}
