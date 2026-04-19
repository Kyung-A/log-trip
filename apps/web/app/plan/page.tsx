import { getPlans } from "@/entities/plan";

import { AuthLayout } from "@/widgets/auth";
import { PlanListClient } from "@/widgets/plan-list";

interface PlanPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function PlanPage({ searchParams }: PlanPageProps) {
  const { tab } = await searchParams;
  const currentTab = (tab as "all" | "ing" | "early" | "end") ?? "all";
  const plans = await getPlans();

  return (
    <AuthLayout>
      <div className="bg-beige min-h-screen w-full overflow-hidden">
        <header className="p-4 sticky top-0 z-30 bg-white">
          <h1 className="text-3xl font-semibold">여행 일정</h1>
          <PlanListClient plans={plans} currentTab={currentTab} />
        </header>
      </div>
    </AuthLayout>
  );
}
