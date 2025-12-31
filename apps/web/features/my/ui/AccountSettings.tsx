"use client";

import { deleteUserProfile } from "@/features/auth";
import { useCallback } from "react";
import { navigateNative } from "@/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const AccountSettings = ({ userId }: { userId?: string }) => {
  const router = useRouter();
  const qc = useQueryClient();

  const handleLogout = useCallback(async () => {
    qc.clear();
    navigateNative("/mypage", "LOGOUT");
  }, [qc]);

  const handleDeleteUser = useCallback(async () => {
    if (!confirm("정말 계정을 삭제 하시겠습니까?")) return;
    const status = await deleteUserProfile(userId);

    if (status) {
      const params = new URLSearchParams({
        id: userId!,
      });
      await fetch(`/api/deleteUser?${params.toString()}`);
      qc.clear();
      navigateNative("/(auth)/login");
    }
  }, [qc, userId]);

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
