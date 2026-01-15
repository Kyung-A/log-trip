import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface IDiaryImageSlider {
  images: { id?: string; url: string }[];
}

export const DiaryImageSlider = memo(({ images }: IDiaryImageSlider) => {
  return (
    <Swiper scrollbar={{ draggable: true }} className="h-100">
      {images.map((img) => (
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
  );
});

DiaryImageSlider.displayName = "DiaryImageSlider";
