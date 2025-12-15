import { Eraser } from "lucide-react";

export const DrawingController = ({
  currentTool,
  setCurrentTool,
  handleAllClear,
  handleDone,
}) => {
  return (
    <section className="flex items-center gap-x-2 mb-2">
      <button
        onClick={() => setCurrentTool("eraser")}
        className={`p-2 rounded-full ${
          currentTool === "eraser" ? "bg-gray-200" : ""
        }`}
      >
        <Eraser
          size={24}
          color={currentTool === "eraser" ? "#333" : "#707070"}
        />
      </button>

      <button
        onClick={handleAllClear}
        className="text-lg font-semibold text-[#707070]"
      >
        전체 지우기
      </button>

      <button
        onClick={handleDone}
        className="ml-auto text-lg font-semibold text-blue-500"
      >
        그리기 완료
      </button>
    </section>
  );
};
