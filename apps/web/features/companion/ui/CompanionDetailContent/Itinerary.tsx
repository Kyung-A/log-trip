import React from "react";
import { IRegion } from "@/features/region";
import { GroupByCountryLabel } from "@/shared";
import dayjs from "dayjs";
import { CalendarDays, Map, MapPin } from "lucide-react";

interface IItinerary {
  startDate?: Date;
  endDate?: Date;
  regions?: IRegion[];
  place?: string;
}

export const Itinerary = React.memo(
  ({ startDate, endDate, regions = [], place }: IItinerary) => {
    return (
      <section>
        <h3 className="text-base font-semibold">여행 일정</h3>

        <div className="p-3 mt-2 rounded-lg bg-zinc-100 gap-y-1">
          <div className="flex items-center gap-x-2">
            <CalendarDays size={16} color="#4b5563" />
            <p className="text-gray-800">
              {dayjs(startDate).format("YY.MM.DD")} ~{" "}
              {dayjs(endDate).format("YY.MM.DD")} (
              {dayjs(endDate).diff(startDate, "days")}일)
            </p>
          </div>

          <div className="flex items-start">
            <div className="flex items-center gap-x-2 py-1">
              <Map size={16} color="#4b5563" />
              <p className="text-gray-800">여행 장소 :</p>
            </div>
            <GroupByCountryLabel regions={regions} />
          </div>

          <div className="flex items-center gap-x-2">
            <MapPin size={16} color="#4b5563" />
            <p className="text-gray-800">만남 장소 : {place}</p>
          </div>
        </div>
      </section>
    );
  }
);

Itinerary.displayName = "Itinerary";
