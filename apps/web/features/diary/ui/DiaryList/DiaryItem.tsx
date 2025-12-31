"use client";

import { useState } from "react";
import { IDiary } from "../../types";
import { DiaryPopoverMenu } from "./DiaryPopoverMenu";
import { DiaryItemHeader } from "./DiaryItemHeader";
import { DiaryImageSlider } from "./DiaryImageSlider";
import { DiaryItemContent } from "./DiaryItemContent";
import { useClickOutside } from "@/shared";

interface IDiaryItem {
  item: IDiary;
  handleDeleteDiary: (item: IDiary) => void;
  handleIsPublicDiaryChange: (id: string, state: boolean) => boolean;
  isNotFeed: boolean;
}

export const DiaryItem = ({
  item,
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
      <article className="w-full h-auto mb-2 bg-white relative">
        <DiaryItemHeader
          profileImage={item.user_info.profile_image}
          name={item.user_info.name}
          isPublic={item.is_public}
          about={item.user_info.about}
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
            onDelete={() => handleDeleteDiary(item)}
            ref={popoverRef}
          />
        )}
      </article>
    </li>
  );
};
