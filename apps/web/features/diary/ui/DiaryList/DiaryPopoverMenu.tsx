import { Trash } from "lucide-react";
import { forwardRef } from "react";

interface IDiaryMenuProps {
  onDelete: () => void;
}

export const DiaryPopoverMenu = forwardRef<HTMLDivElement, IDiaryMenuProps>(
  ({ onDelete }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute right-6 top-15 z-50 w-32 rounded-lg bg-white shadow-[0px_0px_20px_-1px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-x-2 w-full px-4 py-4 text-left text-lg font-semibold text-red-500"
        >
          <Trash size={22} />
          삭제
        </button>
      </div>
    );
  }
);

DiaryPopoverMenu.displayName = "DiaryPopoverMenu";
