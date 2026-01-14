"use client";

import { useFetchUserId, useFetchUserProfile } from "@/features/auth";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { useFetchMyCounter } from "@/features/my";
import { AccountSettings } from "./AccountSettings";

export const MyPageClient = () => {
  const { data: userId } = useFetchUserId();
  const { data: profile } = useFetchUserProfile(userId);
  const { data: counters } = useFetchMyCounter(userId);

  return (
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
      <p className="mt-4 text-xl font-semibold">
        {profile?.nickname ? profile.nickname : profile?.name}
      </p>
      <p className="mt-3">
        {profile?.about ?? "간단한 자기소개를 작성해 주세요!"}
      </p>
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
      <AccountSettings userId={userId} platform={profile?.platform} />
    </div>
  );
};
