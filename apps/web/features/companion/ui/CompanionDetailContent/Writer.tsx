import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

interface IWriter {
  userInfo?: {
    nickname?: string;
    profile_image?: string;
    gender?: string;
    about?: string;
  };
}

export const Writer = React.memo(({ userInfo }: IWriter) => {
  return (
    <Link
      href=""
      className="p-3 rounded-lg bg-zinc-100 flex items-center justify-between"
    >
      <div className="flex items-center gap-x-2">
        <div className="w-12 h-12 overflow-hidden rounded-full">
          <Image
            src={userInfo?.profile_image ?? ""}
            className="object-cover w-full h-full"
            width={0}
            height={0}
            sizes="100vw"
            alt="profile image"
          />
        </div>
        <div>
          <p className="font-semibold">{userInfo?.nickname}</p>
          <p className="text-sm text-gray-600 mt-0.5">
            {userInfo?.gender === "female" ? "여자" : "남자"} ·{" "}
            {userInfo?.about}
          </p>
        </div>
      </div>
      <ChevronRight size={24} color="#9a9a9a" />
    </Link>
  );
});

Writer.displayName = "Writer";
