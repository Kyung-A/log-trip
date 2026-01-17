import { memo } from "react";
import Image from "next/image";
import { EllipsisVertical, UserRound } from "lucide-react";
import { Switch } from "@/shared";
import { useRouter } from "next/navigation";

interface IDiaryITemHeader {
  profileImage: string;
  nickname: string;
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
    nickname,
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
          <div className="overflow-hidden rounded-full w-12 h-12">
            {profileImage ? (
              <Image
                src={profileImage}
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
            <p className="font-semibold text-left line-clamp-1">{nickname}</p>
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
