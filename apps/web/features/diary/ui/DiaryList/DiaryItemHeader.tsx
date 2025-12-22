import { memo } from "react";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";

interface IDiaryITemHeader {
  profileImage: string;
  name: string;
  onToggle: () => void;
}

export const DiaryItemHeader = memo(
  ({ profileImage, name, onToggle }: IDiaryITemHeader) => {
    return (
      <div className="flex w-full items-center justify-between p-4">
        <button
          onClick={() => {
            // TODO: 추후 공개 다이어리 기능 추가시 페이지 이동 필요
          }}
          className="flex items-center gap-x-3"
        >
          <div className="overflow-hidden rounded-full w-14 h-14">
            <Image
              src={profileImage}
              className="object-cover w-full h-full"
              width={0}
              height={0}
              sizes="100vw"
              alt="profile image"
            />
          </div>
          <p className="font-semibold">{name}</p>
        </button>
        <button onClick={() => onToggle()}>
          <EllipsisVertical size={24} color="#303030" />
        </button>
      </div>
    );
  }
);

DiaryItemHeader.displayName = "DiaryItemHeader";
