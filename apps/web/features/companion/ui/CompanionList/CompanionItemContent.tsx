import { CalendarClock, CalendarDays, Users, VenusAndMars } from "lucide-react";
import { ICompanion } from "../..";
import dayjs from "dayjs";

export const CompanionItemContent = ({ item }: { item: ICompanion }) => {
  return (
    <>
      <p className="mt-3 font-semibold line-clamp-1">{item.title}</p>
      <p className="mt-1 text-slate-600 line-clamp-2">{item.content}</p>
      <div className="text-sm mt-3 font-semibold text-blue-500 flex items-center">
        <div className="flex items-center gap-x-2">
          <VenusAndMars size={18} />
          <p>
            {item.gender_preference === "R"
              ? "무관"
              : item.gender_preference === "M"
              ? "남자만"
              : "여자만"}{" "}
          </p>
        </div>

        <div className="flex items-center gap-x-2 ml-6">
          <Users size={18} />
          <p>
            {item.accepted_count} / {item.companion_count}
          </p>
        </div>

        <div className="flex items-center gap-x-2 ml-6">
          <CalendarClock size={18} />
          <p>
            {dayjs(item.deadline_at).diff(new Date(), "days") > 0
              ? `모집 마감 ${dayjs(item.deadline_at).diff(
                  new Date(),
                  "days"
                )}일 전`
              : "곧 마감"}
          </p>
        </div>
      </div>

      <div className="flex items-center mt-1 gap-x-2">
        <CalendarDays size={18} color="#4b5563" />
        <p className="text-sm text-gray-600">여행기간</p>
        <p className="text-sm text-gray-600">
          {dayjs(item.start_date).format("YY.MM.DD")} ~{" "}
          {dayjs(item.end_date).format("YY.MM.DD")} (
          {dayjs(item.end_date).diff(item.start_date, "days")}일)
        </p>
      </div>
    </>
  );
};
