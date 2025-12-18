'use client";';

import { useCallback, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ImagePlus, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface ImageResult {
  origin: string;
  modified: string;
}

interface IUploadImagesProps {
  imgs: ImageResult[];
  setImgs: React.Dispatch<React.SetStateAction<ImageResult[]>>;
  setOpenEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentEditImage: React.Dispatch<React.SetStateAction<string>>;
}

export const UploadImages = ({
  imgs,
  setImgs,
  setOpenEditMode,
  setCurrentEditImage,
}: IUploadImagesProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const latestImgsRef = useRef(imgs);

  const handleDeleted = useCallback(
    (origin: string) =>
      setImgs((prev) => {
        const deletedItem = prev.find((i) => i.origin === origin);

        if (deletedItem) {
          URL.revokeObjectURL(deletedItem.origin);
        }

        return prev.filter((i) => i.origin !== origin);
      }),
    [setImgs]
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files || files.length === 0) return;
      imgs.forEach((item) => URL.revokeObjectURL(item.origin));

      const newImages: ImageResult[] = [];

      Array.from(files).forEach((file) => {
        const objectURL = URL.createObjectURL(file);

        newImages.push({
          origin: objectURL,
          modified: objectURL,
        });
      });

      setImgs((prevImgs) => {
        prevImgs.forEach((item) => URL.revokeObjectURL(item.origin));
        return newImages;
      });

      event.target.value = "";
    },
    [imgs, setImgs]
  );

  useEffect(() => {
    latestImgsRef.current = imgs;
  });

  useEffect(() => {
    return () => {
      latestImgsRef.current.forEach((item) => URL.revokeObjectURL(item.origin));
    };
  }, []);

  return (
    <>
      {imgs.length === 0 && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center w-full py-2 bg-beige gap-x-2"
        >
          <ImagePlus size={20} color="#a38f86" />
          <p className="text-[#a38f86] font-semibold">사진 추가하기</p>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </button>
      )}
      <div className="w-full border-b border-gray-300">
        {imgs && imgs.length > 0 ? (
          <Swiper key={imgs.map((i) => i.origin).join("|")} loop>
            {imgs.map((img) => (
              <SwiperSlide key={img.origin}>
                <button
                  onClick={() => {
                    setOpenEditMode(true);
                    setCurrentEditImage(img.origin);
                  }}
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
                  onClick={() => handleDeleted(img.origin)}
                  className="absolute right-2 top-3 border-2 z-10 rounded-full border-white bg-[#00000099]"
                >
                  <X size={20} color="#fff" />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="flex flex-col items-center justify-center w-full h-full py-32 md:py-64">
            <ImageIcon size={120} color="#f2eeec" />
          </p>
        )}
      </div>
    </>
  );
};
