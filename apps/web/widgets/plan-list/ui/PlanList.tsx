"use client";

import dayjs from "dayjs";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { ITravelPlan } from "@/entities/plan";

import { DeletePlanButton } from "@/features/plan-delete";

interface PlanListClientProps {
  plans: ITravelPlan[];
}

export const PlanList = ({ plans }: PlanListClientProps) => {
  return (
    <ul className="w-full flex flex-col gap-y-4 mt-4 px-4">
      {plans.length === 0 && (
        <li className="text-center text-zinc-400 text-sm">
          여행 일정이 없습니다.
        </li>
      )}
      {plans.map((plan) => (
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
  );
};
