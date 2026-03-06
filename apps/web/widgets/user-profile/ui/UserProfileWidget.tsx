"use client";

import { ChevronLeft, UserRound } from "lucide-react";
import Image from "next/image";

import { IDiaryCounters, IProfile } from "@/entities/user";

import { navigateNative } from "@/shared";

interface IProfileWidgetProps {
  profile: IProfile;
  counters: IDiaryCounters;
  targetId?: string;
  isMine?: boolean;
  children?: React.ReactNode;
}

export const UserProfileWidget = ({
  profile,
  counters,
  isMine,
  children,
}: IProfileWidgetProps) => {
  return (
    <>
      {!isMine && (
        <header className="bg-white max-w-3xl fixed w-full py-2 border-b border-gray-200 flex items-center justify-between px-4 z-10">
          <button
            onClick={() => navigateNative("/public-diary", "WINDOW_LOCATION")}
            className="flex items-center gap-x-1"
          >
            <ChevronLeft size={22} color="#646464" />
            <span className="text-lg">뒤로</span>
          </button>
        </header>
      )}

      <div className="items-center w-full flex flex-col">
        <div className="w-32 h-32 mt-20 bg-[#d5b2a7] rounded-full">
          {profile?.profile_image ? (
            <Image
              src={profile.profile_image}
              className="object-cover w-full h-full rounded-full"
              width={0}
              height={0}
              sizes="100vw"
              alt="profile image"
            />
          ) : (
            <div className="items-center flex justify-center w-full h-full">
              <UserRound size={60} color="#fff" />
            </div>
          )}
        </div>
        <p className="mt-4 text-xl font-semibold">{profile?.nickname}</p>
        <p className="mt-3">{profile?.about ?? "자기소개가 없습니다."}</p>
        <div className="flex items-center mt-6">
          <div className="flex items-center px-6 flex-col">
            <p className="text-sm text-gray-500">공개 여행 일기</p>
            <p className="text-lg mt-0.5 font-semibold text-[#a38f86]">
              {counters?.public_diaries_count}
            </p>
          </div>

          <div className="h-10 w-px bg-gray-200"></div>

          <div className="flex items-center px-6 flex-col">
            <p className="text-sm text-gray-500">총 여행 일기</p>
            <p className="text-lg mt-0.5 font-semibold text-[#a38f86]">
              {counters?.diaries_count}
            </p>
          </div>
          {/* // TODO: 추후 추가 예정
        <button
          onClick={() => router.push("/mypage/apply-status")}
          className="flex items-center px-6 flex-col"
        >
          <p className="text-sm text-gray-500">동행 신청 현황</p>
          <p className="text-lg mt-0.5 font-semibold text-[#a38f86]">
            {counters?.applied_count}
          </p>
        </button>
        <div className="h-10 w-px bg-gray-200"></div>
        <button
          onClick={() => router.push("/mypage/recruit-status")}
          className="flex flex-col items-center px-6"
        >
          <p className="text-sm text-gray-500">동행 모집 현황</p>
          <p className="text-lg mt-0.5 font-semibold text-[#a38f86]">
            {counters?.received_count}
          </p>
        </button> */}
        </div>
        {children}
      </div>
    </>
  );
};
