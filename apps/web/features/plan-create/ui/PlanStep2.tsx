"use client";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import Calendar from "react-calendar";

dayjs.extend(isBetween);

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface PlanStep2Props {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export const PlanStep2 = ({ value, onChange }: PlanStep2Props) => {
  const months = Array.from({ length: 12 }, (_, i) => i);
  const currentYear = dayjs().year();
  const currentMonth = dayjs().month();

  const handleClickDay = (date: Date) => {
    if (!value.start || (value.start && value.end)) {
      onChange({ start: date, end: null });
    } else {
      if (dayjs(date).isBefore(dayjs(value.start), "day")) {
        onChange({ start: date, end: value.start });
      } else {
        onChange({ start: value.start, end: date });
      }
    }
  };

  const getTileClassName = ({
    date,
    view,
  }: {
    date: Date;
    view: string;
  }) => {
    if (view !== "month" || (!value.start && !value.end)) return null;

    const d = dayjs(date).startOf("day");
    const s = value.start ? dayjs(value.start).startOf("day") : null;
    const e = value.end ? dayjs(value.end).startOf("day") : null;

    if (s && d.isSame(s, "day")) return "trip-start";
    if (e && d.isSame(e, "day")) return "trip-end";
    if (s && e && d.isBetween(s, e, "day", "()")) return "trip-range";
    return null;
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-none px-6 py-4 border-b border-zinc-200">
        <h1 className="text-xl font-semibold">여행 날짜를 선택해주세요!</h1>
        {value.start && (
          <p className="mt-1 text-sm text-zinc-500">
            {dayjs(value.start).format("YYYY.MM.DD")}
            {value.end
              ? ` ~ ${dayjs(value.end).format("YYYY.MM.DD")} (${dayjs(value.end).diff(dayjs(value.start), "day") + 1}일)`
              : " ~ 종료일 선택"}
          </p>
        )}
      </div>

      <div className="flex-1 px-6 overflow-y-auto pb-40">
        {months.map((offset) => {
          const monthIndex = (currentMonth + offset) % 12;
          const year =
            currentYear + Math.floor((currentMonth + offset) / 12);
          return (
            <div key={offset} className="mb-10">
              <h3 className="text-sm font-semibold text-zinc-500 mb-2">
                {year}년 {monthIndex + 1}월
              </h3>
              <Calendar
                activeStartDate={new Date(year, monthIndex, 1)}
                showNavigation={false}
                formatShortWeekday={(_, date) =>
                  ["S", "M", "T", "W", "T", "F", "S"][date.getDay()]
                }
                tileClassName={getTileClassName}
                onClickDay={handleClickDay}
                formatDay={(_, date) => date.getDate().toString()}
                calendarType="gregory"
                showNeighboringMonth={false}
                className="w-full! border-none!"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

PlanStep2.displayName = "PlanStep2";
