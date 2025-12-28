'use client";';

import { useCallback, useEffect, useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import { ImageSlider } from "./ImageSlider";
import { Field } from "./Field";

export interface ImageResult {
  origin: string;
  modified: string;
}

interface IUploadImagesProps {
  imgs: ImageResult[];
  setImgs: React.Dispatch<React.SetStateAction<ImageResult[]>>;
  setOpenEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentEditImage: React.Dispatch<React.SetStateAction<string | null>>;
}

export const UploadDiaryImageField = ({
  imgs,
  setImgs,
  setOpenEditMode,
  setCurrentEditImage,
}: IUploadImagesProps) => {
  const latestImgsRef = useRef(imgs);

  // 슬라이드 이미지 삭제
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

  // 이미지 편집 다이얼로그 오픈
  const handleOpenEditDialog = useCallback(
    (url: string) => {
      setOpenEditMode(true);
      setCurrentEditImage(url);
    },
    [setCurrentEditImage, setOpenEditMode]
  );

  // 사진 선택
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
      {imgs.length === 0 && <Field onChange={handleFileChange} />}

      <div className="w-full border-b border-gray-300">
        {imgs && imgs.length > 0 ? (
          <ImageSlider
            images={imgs}
            onEditMode={handleOpenEditDialog}
            onDelete={handleDeleted}
          />
        ) : (
          <p className="flex flex-col items-center justify-center w-full h-full py-32 md:py-64">
            <ImageIcon size={120} color="#f2eeec" />
          </p>
        )}
      </div>
    </>
  );
};
