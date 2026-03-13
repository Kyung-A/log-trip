"use client";

import { useCallback } from "react";

import { useRouter } from "next/navigation";

import { IProfile } from "@/entities/user";

import { deleteUserAction } from "@/features/user-delete";
import { logoutAction } from "@/features/user-logout";

import { navigateNative } from "@/shared";

export const AccountSettings = ({
  userId,
  profile,
}: {
  userId?: string;
  profile: IProfile;
}) => {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    const { success } = await logoutAction();
    if (success) {
      navigateNative("/(auth)/login", "LOGOUT");
    }
  }, []);

  const handleDeleteUser = useCallback(async () => {
    if (
      !confirm(
        "탈퇴 할 경우 모든 데이터가 삭제되며,\n소셜 로그인 연동도 해제됩니다.\n정말 탈퇴 하시겠습니까?",
      )
    )
      return;

    const { success } = await deleteUserAction(userId, profile?.platform);
    if (success) {
      navigateNative("/(auth)/login", "DELETE_USER");
    }
  }, [userId, profile?.platform]);

  return (
    <>
      <button
        onClick={() => router.push("/mypage/update")}
        className="px-20 py-2 mt-14 border rounded-lg border-[#a38f86]"
      >
        <p className="text-[#a38f86]">프로필 수정</p>
      </button>
      <button onClick={() => handleLogout()} className="mt-6">
        <p className="text-[#a38f86] underline">로그아웃</p>
      </button>
      <button onClick={handleDeleteUser} className="mt-4">
        <p className="text-[#a38f86] text-sm">계정 탈퇴</p>
      </button>
    </>
  );
};
