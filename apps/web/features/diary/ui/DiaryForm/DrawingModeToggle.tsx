import { Switch } from "@/shared";

export const DrawingModeToggle = ({ isDrawing, onToggle, onOpen }) => {
  return (
    <div className="flex flex-wrap items-center justify-between w-full px-4 py-2 border-b border-gray-300">
      <p className="mr-4 text-lg">드로잉 모드</p>
      <div className="flex items-center gap-x-2">
        {isDrawing && <button onClick={onOpen}>열기</button>}
        <Switch initialChecked={isDrawing} onToggle={onToggle} />
      </div>
    </div>
  );
};
