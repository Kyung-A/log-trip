"use client";

import dayjs from "dayjs";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { ITravelPlan } from "@/entities/plan";

import { DeletePlanButton } from "@/features/plan-delete";

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

interface PlanListClientProps {
  plans: ITravelPlan[];
  currentTab: TabType;
}

export const PlanListClient = ({ plans, currentTab }: PlanListClientProps) => {
  const filtered = filterPlans(plans, currentTab);

  return (
    <>
      <nav className="mt-2 flex items-center gap-x-2 flex-nowrap overflow-x-auto">
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

      <ul className="w-full flex flex-col gap-y-4 mt-4">
        {filtered.length === 0 && (
          <li className="text-center text-zinc-400 py-10 text-sm">
            여행 일정이 없습니다.
          </li>
        )}
        {filtered.map((plan) => (
          <li key={plan.id} className="px-6 py-4 bg-white rounded-full">
            <div className="flex items-center justify-between">
              <Link
                href={`/plan/${plan.id}`}
                className="flex items-center justify-between flex-1"
              >
                <div>
                  <h2 className="text-lg font-semibold">{plan.title}</h2>
                  <p className="text-sm text-zinc-500">
                    {dayjs(plan.start_date).format("YYYY년 MM월 DD일")} -{" "}
                    {dayjs(plan.end_date).format("YYYY년 MM월 DD일")}
                  </p>
                </div>
                <ChevronRightIcon size={26} color="#d4d4d8" />
              </Link>
              <DeletePlanButton
                planId={plan.id}
                className="ml-3 text-xs text-zinc-400 shrink-0"
              >
                삭제
              </DeletePlanButton>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
