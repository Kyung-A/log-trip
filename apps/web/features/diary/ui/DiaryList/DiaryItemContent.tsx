import { GroupByCountryLabel } from "@/shared";
import dayjs from "dayjs";
import { CalendarDays } from "lucide-react";
import { memo } from "react";
import Image from "next/image";
import { IDiaryRegionsRender } from "../..";

interface DiaryItemContent {
  isDrawing: boolean;
  title: string | null;
  date: Date | null;
  textContent: string | null;
  drawingContent: string | null;
  regions: IDiaryRegionsRender[];
}

export const DiaryItemContent = memo(
  ({
    isDrawing,
    title,
    date,
    textContent,
    drawingContent,
    regions,
  }: DiaryItemContent) => {
    return (
      <>
        <div className="flex-col flex px-4 mb-3 gap-y-2">
          {!isDrawing && <p className="text-xl font-semibold">{title}</p>}

          <div className="flex items-center gap-x-2">
            <CalendarDays size={18} color="#4b5563" />
            <p className="text-base text-gray-600">
              {dayjs(date).format("YYYY-MM-DD")}
            </p>
          </div>

          <GroupByCountryLabel regions={regions} />

          {!isDrawing && (
            <p className="py-4 whitespace-pre-wrap">{textContent}</p>
          )}
        </div>

        {isDrawing && (
          <Image
            src={drawingContent!}
            width={0}
            height={0}
            sizes="100vw"
            className="w-full object-cover"
            alt="diray content image"
          />
        )}
      </>
    );
  },
);

DiaryItemContent.displayName = "DiaryItemContent";
