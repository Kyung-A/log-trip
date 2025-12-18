"use client";

import { useState } from "react";
import { DiaryItem } from "./DiaryItem";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export const DiaryList = ({ data, handleDeleteDiary }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ul className="w-full bg-zinc-100">
      {data?.map((item) => (
        <DiaryItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() =>
            setOpenId((prev) => (prev === item.id ? null : item.id))
          }
          onClose={() => setOpenId(null)}
          handleDeleteDiary={handleDeleteDiary}
        />
      ))}
    </ul>
  );
};
