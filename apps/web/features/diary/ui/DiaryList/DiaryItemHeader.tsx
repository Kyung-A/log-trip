import { memo } from "react";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";
import { navigateNative, Switch } from "@/shared";
import { useRouter } from "next/navigation";

interface IDiaryITemHeader {
  profileImage: string;
  name: string;
  isPublic: boolean;
  handleIsPublicDiaryChange: (state: boolean) => boolean;
  onToggle: () => void;
  isNotFeed: boolean;
  about: string;
  userId: string;
}

export const DiaryItemHeader = memo(
  ({
    profileImage,
    name,
    isPublic,
    handleIsPublicDiaryChange,
    onToggle,
    isNotFeed,
    about,
    userId,
  }: IDiaryITemHeader) => {
    const router = useRouter();

    return (
      <div className="flex w-full items-center justify-between p-4">
        <button
          className="flex items-center gap-x-3"
          onClick={() => !isNotFeed && router.push(`/profile/${userId}`)}
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
          <div>
            <p className="font-semibold text-left line-clamp-1">{name}</p>
            {!isNotFeed && (
              <p className="text-sm text-zinc-600 line-clamp-1 text-left">
                {about}
              </p>
            )}
          </div>
        </button>

        {isNotFeed && (
          <div className="flex items-center gap-x-4">
            <div className="flex items-center gap-x-2">
              <p className="text-sm text-zinc-600">공개</p>
              <Switch
                initialChecked={isPublic}
                onToggle={handleIsPublicDiaryChange}
              />
            </div>
            <button onClick={() => onToggle()}>
              <EllipsisVertical size={24} color="#303030" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

DiaryItemHeader.displayName = "DiaryItemHeader";
