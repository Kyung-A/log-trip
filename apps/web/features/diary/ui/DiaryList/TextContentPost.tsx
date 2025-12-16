"use client";

import { useMemo } from "react";
import dayjs from "dayjs";
import { groupByCountry, GroupByCountryLabel } from "@/shared";
import { CalendarDays } from "lucide-react";
import { IDiary } from "../..";

export function TextContentPost({ data }: { data: IDiary }) {
  const groupedRegions = useMemo(
    () => groupByCountry(data.diary_regions),
    [data]
  );

  const regionItems = useMemo(() => {
    return Object.entries(groupedRegions).map(
      ([countryCode, { country_name, regions }]: any) => ({
        key: countryCode,
        countryName: country_name,
        regions: regions.join(", "),
      })
    );
  }, [groupedRegions]);

  return (
    <div className="flex-col flex px-4 mb-3 gap-y-2">
      <p className="text-xl font-semibold">{data.title}</p>

      <div className="flex items-center gap-x-2">
        <CalendarDays size={18} color="#4b5563" />
        <p className="text-base text-gray-600">
          {dayjs(data.travel_date).format("YYYY-MM-DD")}
        </p>
      </div>

      <div className="flex gap-x-4">
        {regionItems.map((item) => (
          <GroupByCountryLabel
            key={item.key}
            countryName={item.countryName}
            regions={item.regions}
          />
        ))}
      </div>

      <p className="py-4 whitespace-pre-wrap">{data.text_content}</p>
    </div>
  );
}
