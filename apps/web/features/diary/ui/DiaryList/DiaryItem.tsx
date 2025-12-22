"use client";

import { useEffect, useRef } from "react";
import { IDiary } from "../../types";
import { DiaryPopoverMenu } from "./DiaryPopoverMenu";
import { DiaryItemHeader } from "./DiaryItemHeader";
import { DiaryImageSlider } from "./DiaryImageSlider";
import { DiaryItemContent } from "./DiaryItemContent";

interface IDiaryItem {
  item: IDiary;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
  handleDeleteDiary: (item: IDiary) => void;
}

export const DiaryItem = ({
  item,
  isOpen,
  onClose,
  onToggle,
  handleDeleteDiary,
}: IDiaryItem) => {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <li>
      <article className="w-full h-auto mb-2 bg-white relative">
        <DiaryItemHeader
          profileImage={item.user_info.profile_image}
          name={item.user_info.name}
          onToggle={onToggle}
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

        {isOpen && (
          <DiaryPopoverMenu
            onDelete={() => handleDeleteDiary(item)}
            ref={popoverRef}
          />
        )}
      </article>
    </li>
  );
};
