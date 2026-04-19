import dayjs from "dayjs";
import Link from "next/link";

import { getPlans, ITravelPlan } from "@/entities/plan";

import { AuthLayout } from "@/widgets/auth";
import { PlanList } from "@/widgets/plan-list";

interface PlanPageProps {
  searchParams: Promise<{ tab?: string }>;
}

type TabType = "all" | "ing" | "early" | "end";

const TAB_LABELS: Record<TabType, string> = {
  all: "전체",
  ing: "진행중인 여행",
  early: "예정",
  end: "지난 여행",
};

const filterPlans = (plans: ITravelPlan[], tab: TabType) => {
  const today = dayjs().startOf("day");
  return plans.filter((plan) => {
    const start = dayjs(plan.start_date);
    const end = dayjs(plan.end_date);
    if (tab === "ing") return start.isBefore(today) && end.isAfter(today);
    if (tab === "early") return start.isAfter(today);
    if (tab === "end") return end.isBefore(today);
    return true;
  });
};

export default async function PlanPage({ searchParams }: PlanPageProps) {
  const { tab } = await searchParams;
  const currentTab = (tab as "all" | "ing" | "early" | "end") ?? "all";

  const plans = await getPlans();
  const filtered = filterPlans(plans, currentTab);

  return (
    <AuthLayout>
      <div className="bg-beige min-h-screen w-full overflow-hidden">
        <header className="p-4 sticky top-0 z-30 bg-white">
          <h1 className="text-3xl font-semibold">여행 일정</h1>

          <nav className="flex mt-2 items-center gap-x-2 flex-nowrap overflow-x-auto">
            {(Object.keys(TAB_LABELS) as TabType[]).map((tab) => (
              <Link
                key={tab}
                href={`?tab=${tab}`}
                className={`px-4 rounded-full py-0.5 text-base cursor-pointer border shrink-0 ${
                  currentTab === tab
                    ? "bg-[#e9dcd9] border-[#e9dcd9] text-latte font-semibold"
                    : "text-zinc-500 border-zinc-300"
                }`}
                scroll={false}
              >
                {TAB_LABELS[tab]}
              </Link>
            ))}
          </nav>
        </header>

        <PlanList plans={filtered} />
      </div>
    </AuthLayout>
  );
}
