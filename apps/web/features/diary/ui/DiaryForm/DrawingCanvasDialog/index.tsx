"use client";

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DrawingBackground } from "./DrawingBackground";
import { DrawingCanvas } from "./DrawingCanvas";
import { DrawingColors } from "./DrawingColors";
import { DrawingController } from "./DrawingController";

type ColoredPath = {
  points: { x: number; y: number }[];
  color: string;
  lineWidth: number;
};

type Point = {
  x: number;
  y: number;
};

interface IDrawingCanvasDialog {
  isOpenDrawing: boolean;
  setOpenDrawing: Dispatch<SetStateAction<boolean>>;
  handleDrawingImageCapture: (
    imageDataUrl: string,
    canvasSize: {
      width: number;
      height: number;
    }
  ) => void;
}

export const DrawingCanvasDialog = ({
  isOpenDrawing,
  setOpenDrawing,
  handleDrawingImageCapture,
}: IDrawingCanvasDialog) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const currentPath = useRef<Point[]>([]);
  const parentRef = useRef<HTMLDialogElement>(null);

  const [paths, setPaths] = useState<ColoredPath[]>([]);
  const [currentColor, setCurrentColor] = useState("#000");
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser">("pen");
  const [bgImageSrc, setBgImageSrc] = useState<string>("");
  const [loadedBgImage, setLoadedBgImage] = useState<HTMLImageElement | null>(
    null
  );
  const [canvasSize, setCanvasSize] = useState({
    width: 768,
    height: 580,
  });

  // 드로잉 로직
  const drawPaths = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (loadedBgImage) {
      ctx.drawImage(loadedBgImage, 0, 0, canvas.width, canvas.height);
    }

    const pathsToDraw = [...paths];

    // 펜 모드
    if (currentTool === "pen" && currentPath.current.length > 0) {
      pathsToDraw.push({
        points: currentPath.current,
        color: currentColor,
        lineWidth: 3,
      });
    }

    // 경로 반복
    pathsToDraw
      .filter((p) => p.points.length > 0)
      .forEach((p) => {
        ctx.beginPath();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.moveTo(p.points[0].x, p.points[0].y);
        p.points.forEach((point) => ctx.lineTo(point.x, point.y));
        ctx.stroke();
      });
  }, [paths, currentTool, currentColor, loadedBgImage]);

  // 이벤트 핸들러 (마우스 + 터치 통합)
  const getCanvasCoords = (e: { clientX: number; clientY: number }) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (isDrawing.current) return;
    isDrawing.current = true;

    const clientEvent = "touches" in e ? e.touches[0] : e;
    const { x, y } = getCanvasCoords(clientEvent);

    // 펜 모드일 때만 새로운 경로 시작
    if (currentTool === "pen") {
      currentPath.current = [{ x, y }];
    }

    currentPath.current = [{ x, y }];

    if ("touches" in e) {
      canvasRef.current?.addEventListener("touchmove", handleMove);
      canvasRef.current?.addEventListener("touchend", handleUp);
    } else {
      canvasRef.current?.addEventListener("mousemove", handleMove);
      canvasRef.current?.addEventListener("mouseup", handleUp);
    }
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing.current) return;

    const clientEvent = "touches" in e ? e.touches[0] : e;
    const { x, y } = getCanvasCoords(clientEvent);

    if (currentTool === "eraser") {
      const tolerance = 3 * 0.5 + 5;

      const newPaths = paths.filter((path) => {
        const isCollision = path.points.some((point) => {
          const dx = point.x - x;
          const dy = point.y - y;
          const distanceSquared = dx * dx + dy * dy;
          return distanceSquared <= tolerance * tolerance;
        });
        return !isCollision;
      });

      if (newPaths.length !== paths.length) {
        setPaths(newPaths);
      }
      return;
    }

    // 팬 모드
    currentPath.current.push({ x, y });
    drawPaths();
  };

  const handleUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    canvasRef.current?.removeEventListener("mousemove", handleMove);
    canvasRef.current?.removeEventListener("mouseup", handleUp);
    canvasRef.current?.removeEventListener("touchmove", handleMove);
    canvasRef.current?.removeEventListener("touchend", handleUp);

    // 지우개 모드
    if (currentTool === "eraser") {
      return;
    }

    const newPathPoints = currentPath.current.slice();
    currentPath.current = [];

    if (newPathPoints.length > 0) {
      setPaths((prev) => [
        ...prev,
        {
          points: newPathPoints,
          color: currentColor,
          lineWidth: 3,
        },
      ]);
    }
    drawPaths();
  };

  // 색상 변경 핸들러
  const handleChangeColor = (color: string) => {
    setCurrentColor(color);
    setCurrentTool("pen");
  };

  // 모두 지우기
  const handleAllClear = useCallback(() => {
    setPaths([]);
    currentPath.current = [];
    drawPaths();
  }, [drawPaths]);

  // 그리기 완료
  const handleDone = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imageDataUrl = canvas.toDataURL("image/png");
      handleDrawingImageCapture(imageDataUrl, canvasSize);
      setOpenDrawing(false);
    } catch (error) {
      console.error("Canvas capture failed:", error);
    }
  };

  useEffect(() => {
    drawPaths();
  }, [drawPaths, paths, loadedBgImage]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = bgImageSrc;

    img.onload = () => {
      setLoadedBgImage(img);
      requestAnimationFrame(drawPaths);
    };

    img.onerror = () => {
      setLoadedBgImage(null);
    };
  }, [bgImageSrc, drawPaths]);

  return (
    <dialog
      open={isOpenDrawing}
      ref={parentRef}
      className="fixed w-full h-screen inset-0 z-50 bg-white max-w-3xl mx-auto"
    >
      <DrawingCanvas
        parentRef={parentRef}
        canvasRef={canvasRef}
        startDrawing={startDrawing}
        canvasSize={canvasSize}
        setCanvasSize={setCanvasSize}
      />

      <div className="w-full px-4 pt-2 border-t border-gray-300 flex flex-col">
        <DrawingController
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          handleAllClear={handleAllClear}
          handleDone={handleDone}
        />

        <section className="flex items-center gap-x-2">
          <DrawingColors
            handleChangeColor={handleChangeColor}
            currentColor={currentColor}
          />
        </section>

        <div className="mt-3 overflow-x-scroll whitespace-nowrap pb-4">
          <DrawingBackground
            bgImageSrc={bgImageSrc}
            setBgImageSrc={setBgImageSrc}
          />
        </div>
      </div>
    </dialog>
  );
};
