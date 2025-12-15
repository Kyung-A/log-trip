"use client";

import { X } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";

const FRAMES = {
  frame1: "/images/frame/frame1.png",
  frame2: "/images/frame/frame2.png",
  frame3: "/images/frame/frame3.png",
};

export const ImageEditDialog = ({
  isOpenEditMode,
  editImage,
  handleCloseEditMode,
  handleSaveEditMode,
}) => {
  const [canvasSize, setCanvasSize] = useState(0);
  const [frameImage, setFrameImage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const size = Math.floor(entry.contentRect.width);
        setCanvasSize(Math.max(size, 10));
      }
    });

    observer.observe(container);
    return () => {
      observer.unobserve(container);
    };
  }, []);

  useEffect(() => {
    if (!editImage || canvasSize === 0) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = editImage!;

    const drawFrame = (
      ctx: CanvasRenderingContext2D,
      frameSrc: string,
      size: number
    ) => {
      const frameImgElement = new Image();
      frameImgElement.crossOrigin = "Anonymous";
      frameImgElement.src = frameSrc;

      frameImgElement.onload = () => {
        ctx.drawImage(frameImgElement, 0, 0, size, size);
      };
      frameImgElement.onerror = () => {
        console.error("프레임 이미지 로드 실패:", frameSrc);
      };
    };

    image.onload = () => {
      context.clearRect(0, 0, canvasSize, canvasSize);

      const scaleFactor = Math.max(
        canvasSize / image.width,
        canvasSize / image.height
      );

      const scaledImageWidth = image.width * scaleFactor;
      const scaledImageHeight = image.height * scaleFactor;

      const cropOffsetX = (scaledImageWidth - canvasSize) / 2;
      const cropOffsetY = (scaledImageHeight - canvasSize) / 2;

      const sx = cropOffsetX / scaleFactor;
      const sy = cropOffsetY / scaleFactor;
      const sWidth = canvasSize / scaleFactor;
      const sHeight = canvasSize / scaleFactor;

      const dx = 0;
      const dy = 0;
      const dWidth = canvasSize;
      const dHeight = canvasSize;

      context.drawImage(
        image,
        sx,
        sy,
        sWidth,
        sHeight,
        dx,
        dy,
        dWidth,
        dHeight
      );

      if (frameImage) {
        drawFrame(context, frameImage, canvasSize);
      }
    };

    image.onerror = () => {
      console.error("이미지 로드 실패:", editImage);
    };
  }, [editImage, canvasSize, frameImage]);

  return (
    <dialog
      open={isOpenEditMode}
      className="fixed w-full h-screen inset-0 z-50 max-w-3xl mx-auto overflow-hidden"
    >
      <div className="w-full h-full flex flex-col justify-around gap-y-6 py-20 items-center bg-zinc-900">
        <div className="flex justify-between w-full px-4">
          <button onClick={handleCloseEditMode}>
            <X size={28} color="#fff" />
          </button>
          <button
            onClick={handleSaveEditMode}
            className="text-lg font-semibold text-blue-500"
          >
            완료
          </button>
        </div>

        <div
          className="w-full relative overflow-hidden"
          style={{ maxWidth: "50vh", margin: "0 auto" }}
        >
          <div ref={containerRef} className="relative aspect-square">
            <canvas
              ref={canvasRef}
              width={canvasSize || 1}
              height={canvasSize || 1}
              className="absolute inset-0 w-full h-full"
              style={{
                display: canvasSize > 0 ? "block" : "none",
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-x-3">
          <button
            onClick={() => setFrameImage(null)}
            className="flex items-center justify-center w-18 h-18 border border-white"
          >
            <X size={24} color="#fff" />
          </button>
          {Object.entries(FRAMES).map(([key, value]) => (
            <button
              onClick={() => setFrameImage(value)}
              key={key}
              className="block w-18 h-18"
            >
              <NextImage
                src={value}
                width={0}
                height={0}
                className="w-full h-full object-fit"
                alt="frame image"
                sizes="100vw"
              />
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
};
