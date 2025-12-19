"use client";
import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApply } from "@/features/companion-application";

export default function CompanionApplyModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("postId");
  const userId = searchParams.get("userId");

  const [applyMessage, setApplyMessage] = useState<string>();
  const { mutateAsync: applyMutateAsync } = useApply();

  const handleCompanionApplication = useCallback(async () => {
    const body = {
      companion_id: postId,
      applicant_id: userId,
      message: applyMessage,
    };

    const result = await applyMutateAsync(body);
    if (result.status === 201 || result.status === 200) {
      router.replace(`/companion/${postId}`);
    }
  }, [applyMessage, applyMutateAsync, postId, router, userId]);

  return (
    <dialog
      open
      onClick={() => router.back()}
      className="bg-[#00000076] fixed top-0 left-0 max-w-3xl w-screen h-screen flex mx-auto items-center justify-center"
    >
      <div onClick={(e) => e.stopPropagation()} className="w-[90%]">
        <main className="w-full p-6 bg-white rounded-lg">
          <p className="text-lg font-semibold">간단한 메세지를 함께 적으면</p>
          <p className="text-lg font-semibold">매칭될 확률이 높아져요!</p>
          <textarea
            className="w-full p-4 mt-4 rounded-md bg-slate-100 min-h-48 placeholder:text-gray-400"
            placeholder="메세지를 작성해 주세요."
            maxLength={200}
            onChange={(e) => setApplyMessage(e.target.value)}
          />
          <button
            onClick={handleCompanionApplication}
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
