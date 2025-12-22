import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { X } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

export const ImageSlider = ({ images, onEditMode, onDelete }) => {
  return (
    <Swiper key={images.map((i) => i.origin).join("|")} loop>
      {images.map((img) => (
        <SwiperSlide key={img.origin}>
          <button
            onClick={() => onEditMode(img.origin)}
            className="w-full aspect-square relative overflow-hidden"
          >
            <Image
              src={img.modified}
              alt="uploaded image"
              unoptimized
              sizes="100vw"
              width={768}
              height={0}
              className="w-full h-full object-cover"
            />
          </button>

          <button
            onClick={() => onDelete(img.origin)}
            className="absolute right-2 top-3 border-2 z-10 rounded-full border-white bg-[#00000099]"
          >
            <X size={20} color="#fff" />
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
