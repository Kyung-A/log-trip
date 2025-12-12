"use client";

import Image from "next/image";
import { Suspense, useCallback } from "react";
import { EllipsisVertical } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  DrawingiContentPost,
  IDiary,
  TextContentPost,
  useDeleteDiary,
  useFetchDiaries,
} from "@/features/diary";
import Loading from "./loading";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export default function Diary() {
  const { data } = useFetchDiaries();
  const { mutateAsync } = useDeleteDiary();

  const handleDeleteDiary = useCallback(async (item: IDiary) => {
    await mutateAsync(item);
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      {data ? (
        <ul className="w-full bg-zinc-100">
          {data.map((item) => (
            <li key={item.id} className="w-full h-auto mb-2 bg-white">
              <div className="flex w-full items-center justify-between p-4">
                <button
                  onClick={() => console.log("마이페이지")}
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
                <button onClick={() => console.log("더보기")}>
                  <EllipsisVertical size={24} color="#303030" />
                </button>
              </div>

              {item.diary_images && item.diary_images.length > 0 && (
                <div className="mb-3">
                  <Swiper
                    spaceBetween={50}
                    slidesPerView={1}
                    onSlideChange={() => console.log("slide change")}
                    onSwiper={(swiper) => console.log(swiper)}
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
            </li>
          ))}
        </ul>
      ) : (
        <div className="items-center justify-center flex-1 gap-6">
          {/* <Image
            src="@/assets/images/logo.png"
            className="object-cover w-32 h-32"
          /> */}
          <p>나만의 여행 일기를 작성해보세요!</p>
        </div>
      )}
    </Suspense>
  );
}
