"use client";

import { ImagePlus } from "lucide-react";
import { useRef } from "react";

export const Field = ({ onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
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
        onChange={onChange}
        className="hidden"
      />
    </button>
  );
};
