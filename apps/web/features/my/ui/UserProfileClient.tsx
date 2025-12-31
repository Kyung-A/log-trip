"use client";

import { useFetchUserProfile } from "@/features/auth";
import Image from "next/image";
import { ChevronLeft, UserRound } from "lucide-react";
import { useFetchMyCounter } from "@/features/my";
import { useParams } from "next/navigation";
import { navigateNative } from "@/shared";

export const UserProfileClient = () => {
  const { id } = useParams();
  const { data: profile } = useFetchUserProfile(id as string);
  const { data: counters } = useFetchMyCounter(id as string);

  return (
    <>
      <header className="bg-white max-w-3xl fixed w-full py-2 border-b border-gray-200 flex items-center justify-between px-4">
        <button
          onClick={() => navigateNative("/public-diary", "WINDOW_LOCATION")}
          className="flex items-center gap-x-1"
        >
          <ChevronLeft size={22} color="#646464" />
          <span className="text-lg">뒤로</span>
        </button>
      </header>

      <div className="items-center w-full flex flex-col bg-white">
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
        <p className="mt-3">{profile?.about}</p>
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
        </div>
      </div>
    </>
  );
};
