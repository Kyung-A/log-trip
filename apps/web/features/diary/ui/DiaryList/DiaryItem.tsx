"use client";

import { useState } from "react";
import { IDiary } from "../../types";
import { DiaryPopoverMenu } from "./DiaryPopoverMenu";
import { DiaryItemHeader } from "./DiaryItemHeader";
import { DiaryImageSlider } from "./DiaryImageSlider";
import { DiaryItemContent } from "./DiaryItemContent";
import { useClickOutside } from "@/shared";
import { Ban } from "lucide-react";

interface IDiaryItem {
  item: IDiary;
  handleReportDiary: (id: string) => void;
  handleDeleteDiary: (item: IDiary) => void;
  handleIsPublicDiaryChange: (id: string, state: boolean) => boolean;
  isNotFeed: boolean;
}

export const DiaryItem = ({
  item,
  handleReportDiary,
  handleDeleteDiary,
  handleIsPublicDiaryChange,
  isNotFeed,
}: IDiaryItem) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const popoverRef = useClickOutside<HTMLDivElement>(() => {
    setOpenId(null);
  });

  const onToggle = () => {
    setOpenId((prev) => (prev === item.id ? null : item.id) as string | null);
  };

  return (
    <li>
      {item.is_report && isNotFeed ? (
        <article className="w-full h-20 bg-zinc-200 mb-2">
          <div className="w-full flex h-full items-center justify-center gap-x-2 text-zinc-500">
            <Ban size={16} />
            신고 처리된 게시물입니다.
          </div>
        </article>
      ) : (
        <article className="w-full h-auto mb-2 bg-white relative">
          <DiaryItemHeader
            profileImage={item.user_info.profile_image}
            nickname={item.user_info.nickname}
            isPublic={item.is_public}
            about={item.user_info.about}
            userId={item.user_id}
            handleIsPublicDiaryChange={() =>
              handleIsPublicDiaryChange(item.id!, !item.is_public)
            }
            onToggle={onToggle}
            isNotFeed={isNotFeed}
          />

          {item.diary_images && item.diary_images.length > 0 && (
            <div className="mb-3">
              <DiaryImageSlider images={item.diary_images} />
            </div>
          )}

          <DiaryItemContent
            isDrawing={item.is_drawing}
            title={item.title}
            date={item.travel_date}
            textContent={item.text_content}
            drawingContent={item.drawing_content}
            regions={item.diary_regions}
          />

          {openId === item.id && (
            <DiaryPopoverMenu
              onReport={() => handleReportDiary(item.id!)}
              onDelete={() => handleDeleteDiary(item)}
              ref={popoverRef}
              isNotFeed={isNotFeed}
            />
          )}
        </article>
      )}
    </li>
  );
};
