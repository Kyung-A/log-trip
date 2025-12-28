import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface IDrawingBackground {
  bgImageSrc: string;
  setBgImageSrc: Dispatch<SetStateAction<string>>;
}

const DRAWING_IMAGES = {
  drawing1: "/images/drawing/drawing1.jpg",
  drawing2: "/images/drawing/drawing2.jpg",
  drawing3: "/images/drawing/drawing3.jpg",
  drawing4: "/images/drawing/drawing4.jpg",
  drawing5: "/images/drawing/drawing5.jpg",
};

export const DrawingBackground = ({
  bgImageSrc,
  setBgImageSrc,
}: IDrawingBackground) => {
  return (
    <div className="flex items-center gap-x-2">
      <button
        onClick={() => setBgImageSrc("")}
        className="flex items-center justify-center w-20 h-20 border border-gray-300 shrink-0 text-sm"
      >
        배경없음
      </button>
      {Object.entries(DRAWING_IMAGES).map(([key, src]) => (
        <button
          onClick={() => setBgImageSrc(src)}
          key={key}
          className={`w-20 h-20 shrink-0 border-2 transition duration-150 ${
            bgImageSrc === src ? "border-blue-500" : "border-transparent"
          }`}
        >
          <Image
            src={src}
            alt={key}
            className="w-full h-full object-cover"
            width={0}
            height={0}
            sizes="100vw"
          />
        </button>
      ))}
    </div>
  );
};
