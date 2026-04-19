"use client";

import { useState } from "react";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { ChevronDown, ChevronLeft, ChevronUp, MapPin, Plus, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";

import { IPlanItem, ITravelPlan } from "@/entities/plan";
import { IRegion } from "@/entities/region";

import { DeletePlanButton } from "@/features/plan-delete";
import { PlanItemFormBottomSheet } from "@/features/plan-item-create";
import { deletePlanItemAction } from "@/features/plan-item-delete";
import { updatePlanItemAction } from "@/features/plan-item-update";

import { navigateNative } from "@/shared";
import { PlanEditBottomSheet } from "@/widgets/plan-edit";

dayjs.extend(isBetween);

interface PlanDetailClientProps {
  plan: ITravelPlan;
  initialItems: IPlanItem[];
  regions: IRegion[];
}

export const PlanDetailClient = ({
  plan,
  initialItems,
  regions,
}: PlanDetailClientProps) => {
  const router = useRouter();
  const startDate = dayjs(plan.start_date);
  const endDate = dayjs(plan.end_date);
  const totalDays = endDate.diff(startDate, "day") + 1;

  const [activeStartDate, setActiveStartDate] = useState<Date>(
    startDate.startOf("month").toDate(),
  );
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({ 1: true });
  const [items, setItems] = useState<IPlanItem[]>(initialItems);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [addTarget, setAddTarget] = useState<number | null>(null);
  const [editItem, setEditItem] = useState<IPlanItem | null>(null);

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return null;
    const d = dayjs(date).startOf("day");
    const s = startDate.startOf("day");
    const e = endDate.startOf("day");
    if (d.isSame(s, "day")) return "trip-start";
    if (d.isSame(e, "day")) return "trip-end";
    if (d.isBetween(s, e, "day", "()")) return "trip-range";
    return null;
  };

  const toggleDay = (day: number) => {
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const getItemsForDay = (day: number) =>
    items
      .filter((item) => item.day_number === day)
      .sort((a, b) => a.time.localeCompare(b.time));

  const handleDeleteItem = async (item: IPlanItem) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    const result = await deletePlanItemAction(item.id, plan.id);
    if (result.success) {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    return `${hour < 12 ? "AM" : "PM"} ${hour <= 12 ? hour : hour - 12}:${m}`;
  };

  return (
    <div className="w-full relative pb-6">
      <header className="bg-white max-w-3xl sticky top-0 w-full py-2 border-b border-zinc-200 flex items-center justify-between px-4 z-20">
        <button
          onClick={() => navigateNative("/plan", "WINDOW_LOCATION")}
          className="flex items-center gap-x-1"
        >
          <ChevronLeft size={22} color="#646464" />
          <span className="text-lg">뒤로</span>
        </button>
        <div className="flex items-center gap-x-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-x-1 text-sm text-zinc-600"
          >
            <Pencil size={15} />
            수정
          </button>
          <DeletePlanButton
            planId={plan.id}
            redirectTo="/plan"
            className="text-sm text-red-400"
          >
            삭제
          </DeletePlanButton>
        </div>
      </header>

      <main className="w-full min-h-screen bg-white gap-y-6">
        <header className="p-4 border-b border-zinc-200">
          <h1 className="text-xl font-semibold">{plan.title}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {dayjs(plan.start_date).format("YYYY년 MM월 DD일")} -{" "}
            {dayjs(plan.end_date).format("YYYY년 MM월 DD일")}
          </p>
        </header>

        <div className="flex flex-col pt-6 pb-16 gap-y-6">
          <div className="read-only-calendar-wrapper px-4">
            <Calendar
              activeStartDate={activeStartDate}
              onActiveStartDateChange={({ activeStartDate: next }) => {
                if (next) setActiveStartDate(next);
              }}
              tileClassName={getTileClassName}
              minDate={startDate.startOf("month").toDate()}
              maxDate={endDate.endOf("month").toDate()}
              formatDay={(_, date) => date.getDate().toString()}
              calendarType="gregory"
              showNeighboringMonth={false}
              onClickDay={(_, e) => e.stopPropagation()}
              view="month"
              onViewChange={() => {}}
              prev2Label={null}
              next2Label={null}
              className="w-full! border-none!"
            />
          </div>

          <div className="border-t border-zinc-200 px-4">
            <ul>
              {Array.from({ length: totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const date = startDate.add(i, "day");
                const dayItems = getItemsForDay(dayNum);
                const isOpen = openDays[dayNum] ?? false;

                return (
                  <li key={dayNum}>
                    <button
                      className="flex items-center gap-x-2 py-4 w-full"
                      onClick={() => toggleDay(dayNum)}
                    >
                      <h3 className="text-base font-semibold">day {dayNum}</h3>
                      <p className="text-zinc-400 font-semibold">
                        {date.format("MM-DD")}
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddTarget(dayNum);
                        }}
                        className="ml-auto mr-2 flex items-center gap-x-0.5 text-xs text-latte font-semibold"
                      >
                        <Plus size={14} />
                        추가
                      </button>
                      {isOpen ? (
                        <ChevronUp size={20} color="#9f9fa9" />
                      ) : (
                        <ChevronDown size={20} color="#9f9fa9" />
                      )}
                    </button>

                    {isOpen && (
                      <ul className="pb-4">
                        {dayItems.length === 0 && (
                          <li className="text-sm text-zinc-400 py-2">
                            일정이 없습니다.
                          </li>
                        )}
                        {dayItems.map((item, idx) => {
                          const isLast = idx === dayItems.length - 1;
                          return (
                            <li
                              key={item.id}
                              className="flex items-stretch gap-x-4 mb-2 last:mb-0"
                            >
                              <div
                                className={`flex-1 relative ${!isLast ? "after:border-l after:border-dashed after:border-latte after:absolute after:left-1/2 after:top-1 after:h-full after:-translate-x-1/2" : ""}`}
                              >
                                <p className="rounded border-latte text-latte text-sm border text-center py-0.5 bg-white z-20 relative">
                                  {formatTime(item.time)}
                                </p>
                              </div>

                              <button
                                className="border p-3 rounded border-zinc-300 flex-3 text-left"
                                onClick={() => setEditItem(item)}
                              >
                                <div className="flex items-start justify-between">
                                  <h4 className="text-base font-semibold">
                                    {item.title}
                                  </h4>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteItem(item);
                                    }}
                                    className="text-xs text-zinc-400 ml-2 shrink-0"
                                  >
                                    삭제
                                  </button>
                                </div>
                                {item.place && (
                                  <div className="flex items-center gap-x-1">
                                    <MapPin size={16} color="#d5b2a8" />
                                    <p className="text-sm text-milk-pink font-semibold">
                                      {item.place}
                                    </p>
                                  </div>
                                )}
                                {item.memo && (
                                  <p className="text-sm text-zinc-600 mt-1">
                                    {item.memo}
                                  </p>
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </main>

      {/* 세부 일정 추가 */}
      {addTarget !== null && (
        <PlanItemFormBottomSheet
          isOpen={addTarget !== null}
          setIsOpen={(open) => {
            if (!open) setAddTarget(null);
          }}
          planId={plan.id}
          dayNumber={addTarget}
          onSuccess={() => router.refresh()}
        />
      )}

      {/* 세부 일정 수정 */}
      {editItem && (
        <PlanItemFormBottomSheet
          isOpen={!!editItem}
          setIsOpen={(open) => {
            if (!open) setEditItem(null);
          }}
          planId={plan.id}
          dayNumber={editItem.day_number}
          defaultValues={editItem}
          onSubmitAction={(values) =>
            updatePlanItemAction(editItem.id, plan.id, {
              title: values.title,
              time: values.time,
              place: values.place || null,
              memo: values.memo || null,
            })
          }
          onSuccess={() => router.refresh()}
        />
      )}

      {/* 일정 수정 */}
      <PlanEditBottomSheet
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        plan={plan}
        regions={regions}
      />
    </div>
  );
};
