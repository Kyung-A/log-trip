// components/DrawingCanvas.tsx
"use client";

import { useEffect } from "react";

export const DrawingCanvas = ({
  parentRef,
  canvasRef,
  startDrawing,
  canvasSize,
  setCanvasSize,
}) => {
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
