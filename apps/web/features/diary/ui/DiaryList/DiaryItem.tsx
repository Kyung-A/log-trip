"use client";

import { EllipsisVertical, Trash } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { DrawingiContentPost } from "./DrawingiContentPost";
import { TextContentPost } from "./TextContentPost";
import { useEffect, useRef } from "react";

export const DiaryItem = ({
  item,
  isOpen,
  onClose,
  onToggle,
  handleDeleteDiary,
}) => {
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
    <li className="w-full h-auto mb-2 bg-white relative">
      <div className="flex w-full items-center justify-between p-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            console.log("마이페이지");
          }}
          className="flex items-center gap-x-3"
        >
          <div className="overflow-hidden rounded-full w-14 h-14">
            <Image
              src={item.user_info.profile_image}
              className="object-cover w-full h-full"
              width={0}
              height={0}
              sizes="100vw"
              alt="profile image"
            />
          </div>
          <p className="font-semibold">
            {item.user_info.name ?? item.user_info.nickname}
          </p>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <EllipsisVertical size={24} color="#303030" />
        </button>
      </div>

      {item.diary_images && item.diary_images.length > 0 && (
        <div className="mb-3">
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            className="h-[400px]"
          >
            {item.diary_images.map((img) => (
              <SwiperSlide key={img.id}>
                <Image
                  src={img.url}
                  sizes="100vw"
                  width={0}
                  height={0}
                  className="w-full h-full object-cover"
                  alt="diary image"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {item.is_drawing ? (
        <DrawingiContentPost data={item} />
      ) : (
        <TextContentPost data={item} />
      )}

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute right-6 top-15 z-50 w-32 rounded-lg bg-white shadow-[0px_0px_20px_-1px_rgba(0,0,0,0.5)]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => handleDeleteDiary(item)}
            className="flex items-center gap-x-2 w-full px-4 py-4 text-left text-lg font-semibold text-red-500"
          >
            <Trash size={22} />
            삭제
          </button>
        </div>
      )}
    </li>
  );
};
