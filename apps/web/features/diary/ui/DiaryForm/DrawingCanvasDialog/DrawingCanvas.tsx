// components/DrawingCanvas.tsx
"use client";

import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

interface IDrawingCanvas {
  parentRef: RefObject<HTMLDialogElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  startDrawing: (
    e: React.TouchEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>
  ) => void;
  canvasSize: {
    width: number;
    height: number;
  };
  setCanvasSize: Dispatch<
    SetStateAction<{
      width: number;
      height: number;
    }>
  >;
}

export const DrawingCanvas = ({
  parentRef,
  canvasRef,
  startDrawing,
  canvasSize,
  setCanvasSize,
}: IDrawingCanvas) => {
  useEffect(() => {
    const parent = parentRef.current;
    const canvas = canvasRef.current;
    if (!parent || !canvas) return;

    const updateCanvasSize = () => {
      const { clientWidth, clientHeight } = parent;
      setCanvasSize({ width: clientWidth, height: clientHeight - 200 });
    };

    updateCanvasSize();

    const observer = new ResizeObserver(updateCanvasSize);
    observer.observe(parent);

    return () => {
      observer.unobserve(parent);
    };
  }, [canvasRef, parentRef, setCanvasSize]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      style={{ touchAction: "none" }}
      className="bg-white cursor-crosshair"
      onMouseDown={startDrawing}
      onTouchStart={startDrawing}
    />
  );
};
