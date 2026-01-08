"use client";
export const dynamic = "force-dynamic";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAcceptCompanion } from "@/features/companion-application";
import { toast } from "react-toastify";
import { navigateNative } from "@/shared";
import dayjs from "dayjs";

export default function CompanionApplyModal() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const postId = searchParams.get("postId");
  const companionId = searchParams.get("companionId");
  const userId = searchParams.get("userId");

  const [applyMessage, setApplyMessage] = useState<string>();
  const { mutateAsync: acceptMutateAsync } = useAcceptCompanion();

  const handleAcceptCompanion = useCallback(async () => {
    if (!applyMessage) {
      toast.error("메세지 작성은 필수 입니다.");
      return;
    }

    const body = {
      id: postId!,
      decided_by: userId!,
      companion_id: companionId!,
      decision_message: applyMessage,
      decided_at: dayjs(),
    };

    const status = await acceptMutateAsync(body);
    if (status === 204) {
      navigateNative("/mypage", "WINDOW_LOCATION");
    }
  }, [acceptMutateAsync, applyMessage, companionId, postId, userId]);

  return (
    <dialog
      open
      onClick={() => router.back()}
      className="bg-[#00000076] fixed top-0 left-0 max-w-3xl w-screen h-screen flex mx-auto items-center justify-center"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-[90%]">
        <main className="p-6 bg-white rounded-lg">
          <p className="text-lg font-semibold">수락할 신청자에게</p>
          <p className="text-lg font-semibold">
            원할한 소통을 위해 메세지를 남겨주세요!
          </p>
          <textarea
            className="w-full resize-none p-4 mt-4 rounded-md bg-slate-100 min-h-40 placeholder:text-gray-400"
            placeholder="앞으로 연락은 XXX으로 해주시면 됩니다."
            maxLength={200}
            onChange={(e) => setApplyMessage(e.target.value)}
          />
          <button
            onClick={handleAcceptCompanion}
            className="w-full bg-[#d5b2a7] mt-4 rounded-md"
          >
            <p className="py-2 text-lg font-semibold text-center text-white">
              완료
            </p>
          </button>
        </main>
      </div>
    </dialog>
  );
}
