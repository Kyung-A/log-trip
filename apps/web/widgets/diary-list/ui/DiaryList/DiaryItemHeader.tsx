import { memo, useCallback, useState } from "react";

import { EllipsisVertical, UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { IDiary } from "@/entities/diary";

interface IDiaryITemHeader {
  item: IDiary;
  onToggle: () => void;
  isNotFeed: boolean;
  handleIsPublicDiaryChange: (
    id: string,
    state: boolean,
    userId?: string,
  ) => void;
}

export const DiaryItemHeader = memo(
  ({
    item,
    onToggle,
    isNotFeed,
    handleIsPublicDiaryChange,
  }: IDiaryITemHeader) => {
    const router = useRouter();
    const [publicChecked, setPublicChecked] = useState<boolean>(item.is_public);

    const handleChecked = useCallback(
      (checked: boolean) => {
        setPublicChecked((prev) => !prev);
        handleIsPublicDiaryChange(item.id!, checked, item.user_id);
      },
      [handleIsPublicDiaryChange, item.id, item.user_id],
    );

    return (
      <div className="flex w-full items-center justify-between p-4">
        <button
          className="flex items-center gap-x-3"
          onClick={() => !isNotFeed && router.push(`/profile/${item.user_id}`)}
        >
          <div className="overflow-hidden rounded-full w-12 h-12">
            {item.user_info.profile_image ? (
              <Image
                src={item.user_info.profile_image}
                className="object-cover w-full h-full"
                width={0}
                height={0}
                sizes="100vw"
                alt="profile image"
              />
            ) : (
              <div className="items-center flex justify-center w-full h-full bg-zinc-200">
                <UserRound size={30} color="#fff" />
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-left line-clamp-1">
              {item.user_info.nickname}
            </p>
            {!isNotFeed && (
              <p className="text-sm text-zinc-600 line-clamp-1 text-left">
                {item.user_info.about}
              </p>
            )}
          </div>
        </button>
        <div className="flex items-center gap-x-4">
          {isNotFeed && (
            <div className="flex items-center gap-x-2">
              <p className="text-sm text-zinc-600">공개</p>
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked={publicChecked}
                  onChange={(e) => {
                    handleChecked(e.target.checked);
                  }}
                  className="sr-only"
                />

                <div
                  className={`
                    relative w-12 h-6 rounded-full transition-colors duration-300 ease-in-out 
                    ${publicChecked ? "bg-[#d5b2a8]" : "bg-gray-300"}
                  `}
                  aria-hidden="true"
                >
                  <div
                    className={`
                      absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md 
                      transition-transform duration-300 ease-in-out
                      ${publicChecked ? "translate-x-6" : "translate-x-0"}
                    `}
                  />
                </div>
              </label>
            </div>
          )}
          <button onClick={() => onToggle()}>
            <EllipsisVertical size={24} color="#303030" />
          </button>
        </div>
      </div>
    );
  },
);

DiaryItemHeader.displayName = "DiaryItemHeader";
