"use client";

import { useCallback } from "react";
import { navigateNative } from "@/shared";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const AccountSettings = ({
  userId,
  platform,
}: {
  userId?: string;
  platform?: string;
}) => {
  const router = useRouter();
  const qc = useQueryClient();

  const handleLogout = useCallback(async () => {
    qc.clear();
    navigateNative("/mypage", "LOGOUT"); // * 로그아웃 처리는 RN 쪽에서 처리
  }, [qc]);

  const handleDeleteUser = useCallback(async () => {
    if (
      !confirm(
        "탈퇴 할 경우 모든 데이터가 삭제되며,\n소셜 로그인 연동도 해제됩니다.\n정말 탈퇴 하시겠습니까?"
      )
    )
      return;

    try {
      qc.clear();
      navigateNative("/mypage", "DELETE-USER");

      const response = await fetch("/api/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          platform: platform,
        }),
      });

      if (!response.ok) throw new Error("탈퇴 처리 중 에러 발생");
    } catch (error) {
      alert("탈퇴 처리에 실패했습니다.");
      console.error(error);
    }
  }, [qc, userId, platform]);

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
