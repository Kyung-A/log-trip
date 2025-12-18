"use client";

import {
  deleteUserProfile,
  logout,
  useFetchUserId,
  useFetchUserProfile,
} from "@/features/auth";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { useFetchMyCounter } from "@/features/my";
import { navigateNative } from "@/shared";
import { useRouter } from "next/navigation";

export interface IProfile {
  year_of_birth: string;
  created_at: string;
  gender: string;
  id: string;
  mobile_carrier: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  platform: string;
  about: string;
  profile_image: string;
}

export default function MyPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { data: userId } = useFetchUserId();
  const { data: profile } = useFetchUserProfile(userId);
  const { data: counters } = useFetchMyCounter(userId);

  const handleLogout = useCallback(async () => {
    await logout();
    qc.clear();
    navigateNative("/(auth)/login");
  }, [qc]);

  // TODO: 데이터 모두 삭제할지 말지?
  const handleDeleteUser = useCallback(async () => {
    if (!confirm("정말 계정을 삭제 하시겠습니까?")) return;
    await deleteUserProfile(userId);
    const params = new URLSearchParams({
      id: userId,
    });
    await fetch(`/api/deleteUser?${params.toString()}`);
    qc.clear();
    navigateNative("/(auth)/login");
  }, [qc, userId]);

  return (
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
      <p className="mt-4 text-xl font-semibold">{profile?.nickname}</p>
      <p className="mt-3">
        {profile?.about ?? "간단한 자기소개를 작성해 주세요!"}
      </p>
      <div className="flex items-center mt-6">
        <div className="flex items-center px-6 flex-col">
          <p className="text-sm text-gray-500">여행 일기</p>
          <p className="text-lg mt-0.5 font-semibold text-[#a38f86]">
            {counters?.diaries_count}
          </p>
        </div>

        <div className="h-10 w-px bg-gray-200"></div>

        <button
          onClick={() => console.log("ApplyStatus")}
          className="flex items-center px-6 flex-col"
        >
          <p className="text-sm text-gray-500">동행 신청 현황</p>
          <p className="text-lg mt-0.5 font-semibold text-[#a38f86]">
            {counters?.applied_count}
          </p>
        </button>

        <div className="h-10 w-px bg-gray-200"></div>

        <button
          onClick={() => console.log("RecruitStatus")}
          className="flex flex-col items-center px-6"
        >
          <p className="text-sm text-gray-500">동행 모집 현황</p>
          <p className="text-lg mt-0.5 font-semibold text-[#a38f86]">
            {counters?.received_count}
          </p>
        </button>
      </div>
      <button
        onClick={() => router.push("/mypage/update")}
        className="px-20 py-2 mt-14 border rounded-lg border-[#a38f86]"
      >
        <p className="text-[#a38f86]">프로필 수정</p>
      </button>
      <button onClick={handleLogout} className="mt-6">
        <p className="text-[#a38f86] underline">로그아웃</p>
      </button>
      <button onClick={handleDeleteUser} className="mt-4">
        <p className="text-[#a38f86] text-sm">계정 탈퇴</p>
      </button>
    </div>
  );
}
