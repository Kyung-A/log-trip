"use client";

import dayjs from "dayjs";
import { useMemo } from "react";
import Image from "next/image";
import { groupByCountry, GroupByCountryLabel } from "@/shared";
import { IDiary } from "../..";
import { CalendarDays } from "lucide-react";

export function DrawingiContentPost({ data }: { data: IDiary }) {
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
    <>
      <div className="flex-col flex px-4 mb-3 gap-y-2">
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
      </div>

      <Image
        src={data.drawing_content}
        width={0}
        height={0}
        sizes="100vw"
        className="object-fill w-full h-full"
        alt="content image"
      />
    </>
  );
}
