"use client";

import { useRef, useState } from "react";

import dayjs from "dayjs";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { ITravelPlan } from "@/entities/plan";

import { DeletePlanButton } from "@/features/plan-delete";

interface PlanListClientProps {
  plans: ITravelPlan[];
}

const REVEAL_WIDTH = 72;

export const PlanList = ({ plans }: PlanListClientProps) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const touchStartX = useRef(0);

  return (
    <div className="w-full mt-4 px-4">
      {openId && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenId(null)}
          onTouchStart={() => setOpenId(null)}
        />
      )}
      <ul className="flex flex-col gap-y-4">
        {plans.length === 0 && (
          <li className="text-center text-zinc-400 text-sm">
            여행 일정이 없습니다.
          </li>
        )}
        {plans.map((plan) => {
          const isOpen = openId === plan.id;
          return (
            <li
              key={plan.id}
              className="relative overflow-hidden rounded-full z-20"
              onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const delta = e.changedTouches[0].clientX - touchStartX.current;
                if (delta < -50) setOpenId(plan.id);
                else if (delta > 50) setOpenId(null);
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 flex items-center rounded-r-full px-5">
                <DeletePlanButton
                  planId={plan.id}
                  className="text-sm whitespace-nowrap text-red-600"
                >
                  삭제
                </DeletePlanButton>
              </div>

              <div
                className="px-6 py-4 bg-white rounded-full relative z-10 transition-transform duration-200"
                style={{
                  transform: `translateX(${isOpen ? `-${REVEAL_WIDTH}px` : "0"})`,
                }}
              >
                <Link
                  href={`/plan/${plan.id}`}
                  className="flex items-center justify-between"
                  onClick={(e) => {
                    if (isOpen) e.preventDefault();
                  }}
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
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
