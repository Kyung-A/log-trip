"use client";

import { useFetchUserId } from "@/features/auth";
import {
  IApplyStatus,
  useCancelApply,
  useMyApplyStatus,
} from "@/features/companion-application";
import { EmptyView, navigateNative } from "@/shared";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const statusLabel = {
  pending: <p className="text-sm font-semibold text-green-700">● 대기중</p>,
  accepted: <p className="text-sm font-semibold text-blue-600">● 매칭완료</p>,
  rejected: <p className="text-sm font-semibold text-red-800">● 거절</p>,
  cancelled: <p className="text-sm font-semibold text-slate-300">● 신청취소</p>,
};

// TODO: 추후 추가 예정 서비스
const StatusCard = React.memo(({ item }: { item: IApplyStatus }) => {
  const { mutate } = useCancelApply();

  return (
    <div key={item.id} className="w-full h-auto mb-2 bg-white">
      <div className="p-6">
        <Link href={`/companion/${item.companion_id}`}>
          <div className="flex items-center justify-between">
            <p className="w-full mb-1 text-left text-lg font-semibold line-clamp-1">
              {item.companion.title}
            </p>
            {item.status === "accepted" && !item.decision_read_at && (
              <div className="px-2 py-0.5 rounded-md bg-blue-100">
                <p className="text-xs font-semibold text-blue-600">NEW</p>
              </div>
            )}
          </div>

          {statusLabel[item.status]}

          {item.status === "accepted" && (
            <div className="w-full text-left p-4 mt-2 rounded-md bg-zinc-100">
              <p>모집자의 메세지</p>
              <p className="mt-1 whitespace-pre-wrap text-zinc-500">
                {item.decision_message}
              </p>
            </div>
          )}
        </Link>
        {(item.status === "pending" || item.status === "accepted") && (
          <button
            onClick={() => mutate(item)}
            className="w-full mt-4 bg-beige rounded-lg"
          >
            <p className="text-[#a38f86] py-4 text-center font-bold">
              취소하기
            </p>
          </button>
        )}
      </div>
    </div>
  );
});

StatusCard.displayName = "StatusCard";

export default function ApplyStatus() {
  const { data: userId } = useFetchUserId();
  const { data } = useMyApplyStatus(userId);

  return (
    <div className="w-full bg-beige min-h-screen">
      <header className="bg-white flex max-w-3xl fixed top-0 w-full py-2 border-b border-gray-200 px-4">
        <button
          onClick={() => navigateNative("/mypage", "WINDOW_LOCATION")}
          className="flex items-center gap-x-1"
        >
          <ChevronLeft size={22} color="#646464" />
          <span className="text-lg">뒤로</span>
        </button>
        <p className="text-lg translate-x-1/2 -ml-2.5 font-semibold">
          나의 동행 신청 현황
        </p>
      </header>

      {data && data?.length > 0 ? (
        <ul className="pt-10">
          {data?.map((item) => (
            <StatusCard key={item.id} item={item} />
          ))}
        </ul>
      ) : (
        <EmptyView message="여행을 함께 할 동행을 구해보세요!" />
      )}
    </div>
  );
}
