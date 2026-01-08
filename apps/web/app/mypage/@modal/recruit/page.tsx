import { CompanionRecruitAcceptModal } from "@/features/companion-application";
import { Suspense } from "react";

export default function CompanionRecruitAccept() {
  return (
    <Suspense fallback={null}>
      <CompanionRecruitAcceptModal />
    </Suspense>
  );
}
