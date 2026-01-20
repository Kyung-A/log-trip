import { MessageCircleWarning, Trash } from "lucide-react";
import { forwardRef } from "react";

interface IDiaryMenuProps {
  onDelete: () => void;
  onReport: () => void;
  isNotFeed: boolean;
}

export const DiaryPopoverMenu = forwardRef<HTMLDivElement, IDiaryMenuProps>(
  ({ onDelete, onReport, isNotFeed }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute right-6 top-15 z-50 w-32 rounded-lg bg-white shadow-[0px_0px_20px_-1px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      >
        {isNotFeed ? (
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-x-2 w-full px-4 py-4 text-left text-lg font-semibold text-red-500"
          >
            <Trash size={22} />
            삭제
          </button>
        ) : (
          <button
            type="button"
            onClick={onReport}
            className="flex items-center gap-x-2 w-full px-4 py-4 text-left text-lg font-semibold text-red-500"
          >
            <MessageCircleWarning size={22} />
            신고
          </button>
        )}
      </div>
    );
  },
);

DiaryPopoverMenu.displayName = "DiaryPopoverMenu";
