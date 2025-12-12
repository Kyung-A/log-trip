import React from "react";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import { GroupByCountryLabel } from "@/features/diary";
import { useMemo } from "react";
import { groupByCountry } from "@/shared";
import { CalendarDays } from "lucide-react";

export const CompanionCard = React.memo(({ item }) => {
  const groupedRegions = useMemo(
    () => groupByCountry(item.companion_regions),
    [item]
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
    <Link
      href={`/companion/${item.id}`}
      key={item.id}
      className="w-full h-auto mb-2 bg-white block"
    >
      <div className="flex-col p-4">
        <div className="flex gap-x-4">
          {regionItems.map((item) => (
            <GroupByCountryLabel
              key={item.key}
              countryName={item.countryName}
              regions={item.regions}
            />
          ))}
        </div>
        <p className="mt-3 font-semibold line-clamp-1">{item.title}</p>
        <p className="mt-1 text-slate-600 line-clamp-2">{item.content}</p>
        <div className="flex items-center my-3 gap-x-2">
          <div className="w-5 h-5 overflow-hidden rounded-full">
            <Image
              src={item.user_info.profile_image}
              className="object-cover w-full h-full"
              width={0}
              height={0}
              sizes="100vw"
              alt="profile image"
            />
          </div>
          <p className="text-sm text-slate-700">
            {item.user_info.nickname} ·{" "}
            {item.user_info.gender === "female" ? "여자" : "남자"}
          </p>
        </div>

        <p className="text-sm font-semibold text-blue-500">
          {item.gender_preference === "R"
            ? "무관"
            : item.gender_preference === "M"
            ? "남자만"
            : "여자만"}{" "}
          · {item.accepted_count} / {item.companion_count} ·{" "}
          {dayjs(item.deadline_at).diff(new Date(), "days") > 0
            ? `모집 마감 ${dayjs(item.deadline_at).diff(
                new Date(),
                "days"
              )}일 전`
            : "곧 마감"}
        </p>
        <div className="flex items-center mt-1 gap-x-2">
          <CalendarDays size={18} color="#4b5563" />
          <p className="text-sm text-gray-600">
            {dayjs(item.start_date).format("YY.MM.DD")} ~{" "}
            {dayjs(item.end_date).format("YY.MM.DD")} (
            {dayjs(item.end_date).diff(item.start_date, "days")}일)
          </p>
        </div>
      </div>
    </Link>
  );
});

CompanionCard.displayName = "CompanionCard";
