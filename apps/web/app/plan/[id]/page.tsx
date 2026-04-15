"use client";

import { useState } from "react";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { ChevronDown, ChevronLeft, MapPin } from "lucide-react";
import Calendar from "react-calendar";

import { navigateNative } from "@/shared";

dayjs.extend(isBetween);

export default function PlanDetail() {
  const startDate = dayjs("2026-4-16");
  const endDate = dayjs("2026-4-20");

  const [activeStartDate, setActiveStartDate] = useState<Date>(
    startDate.startOf("month").toDate(),
  );

  const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month") {
      const currentDay = dayjs(date).startOf("day");
      const s = startDate.startOf("day");
      const e = endDate.startOf("day");

      if (currentDay.isSame(s, "day")) return "trip-start";
      if (currentDay.isSame(e, "day")) return "trip-end";
      if (currentDay.isBetween(s, e, "day", "()")) return "trip-range";
    }
    return null;
  };

  return (
    <div className="w-full relative pb-6">
      <header className="bg-white max-w-3xl fixed w-full py-2 border-b border-zinc-200 flex items-center justify-between px-4">
        <button
          onClick={() => navigateNative("/plan", "WINDOW_LOCATION")}
          className="flex items-center gap-x-1"
        >
          <ChevronLeft size={22} color="#646464" />
          <span className="text-lg">뒤로</span>
        </button>
      </header>

      <main className="w-full pt-12 min-h-screen bg-white gap-y-6">
        <header className="p-4 border-b border-zinc-200">
          <h1 className="text-xl font-semibold">인도네시아 발리 여행</h1>
          <p className="mt-1 text-sm text-zinc-500">
            2023년 5월 15일 - 2023년 5월 20일
          </p>
        </header>

        <div className="flex flex-col pt-6 pb-16 gap-y-6 ">
          <div className="read-only-calendar-wrapper px-4">
            <Calendar
              activeStartDate={activeStartDate}
              onActiveStartDateChange={({ activeStartDate: nextDate }) => {
                if (nextDate) setActiveStartDate(nextDate);
              }}
              tileClassName={getTileClassName}
              minDate={startDate.startOf("month").toDate()}
              maxDate={endDate.endOf("month").toDate()}
              formatDay={(locale, date) => date.getDate().toString()}
              calendarType="gregory"
              showNeighboringMonth={false}
              onClickDay={(value, event) => event.stopPropagation()}
              view="month"
              onViewChange={() => {}}
              prev2Label={null}
              next2Label={null}
              className="w-full! border-none!"
            />
          </div>

          <div className="border-t border-zinc-200 px-4">
            <ul>
              {Array.from({ length: endDate.diff(startDate, "day") }).map(
                (_, index) => (
                  <li key={index}>
                    <button className="flex items-center gap-x-2 py-4 w-full">
                      <h3 className="text-base font-semibold">
                        day {index + 1}
                      </h3>
                      <p className="text-zinc-400 font-semibold">04-02</p>
                      <ChevronDown
                        size={20}
                        color="#9f9fa9"
                        className="ml-auto"
                      />
                    </button>

                    <ul>
                      {Array.from({ length: 3 }).map((_, index) => {
                        const isLast = index === 2;

                        return (
                          <li
                            key={index}
                            className="flex items-stretch gap-x-4 mb-2 last:mb-0"
                          >
                            <div
                              className={`flex-1 relative ${!isLast ? "after:border-l after:border-dashed after:border-latte after:absolute after:left-1/2 after:top-1 after:h-full after:-translate-x-1/2" : ""}`}
                            >
                              <p className="rounded border-latte text-latte text-sm border text-center py-0.5 bg-white z-20 relative">
                                09:00 AM
                              </p>
                            </div>

                            <div className="border p-3 rounded border-zinc-300 flex-3">
                              <h4 className="text-base font-semibold">기상</h4>
                              <div className="flex items-center gap-x-1">
                                <MapPin size={16} color="#d5b2a8" />
                                <p className="text-sm text-milk-pink font-semibold">
                                  땡땡 호텔
                                </p>
                              </div>
                              <p className="text-sm text-zinc-600 mt-1">
                                일어나서 샤워하고 조식 먹으러 출발하기
                              </p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
