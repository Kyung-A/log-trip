"use client";

import { useFetchUserId } from "@/features/auth";
import {
  IApplicantsForMyPost,
  useApplicantsForMyPosts,
  useRejectCompanion,
} from "@/features/companion-application";
import { EmptyView, navigateNative } from "@/shared";
import dayjs from "dayjs";
import { ChevronLeft, User } from "lucide-react";
import React from "react";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import Link from "next/link";

const statusLabel = {
  pending: (
    <p className="text-sm font-semibold text-left text-green-700">● 대기중</p>
  ),
  accepted: (
    <p className="text-sm font-semibold text-left text-blue-600">● 매칭완료</p>
  ),
  rejected: (
    <p className="text-sm font-semibold text-left text-red-600">● 거절</p>
  ),
  cancelled: (
    <p className="text-sm font-semibold text-left text-slate-400">● 신청취소</p>
  ),
};

const StatusCard = React.memo(
  ({ item, userId }: { item: IApplicantsForMyPost; userId: string }) => {
    const { mutate: rejectMutate } = useRejectCompanion();

    return (
      <>
        <div key={item.id} className="w-full h-auto mb-2 bg-white">
          <div className="p-6">
            <Link href={`/companion/${item.companion.id}`}>
              <p className="text-lg text-left font-semibold line-clamp-1">
                {item.companion.title}
              </p>

              <div className="w-full p-4 mt-4 rounded-md bg-zinc-100">
                <div className="flex flex-row items-center gap-x-2">
                  <div className="w-6 h-6 overflow-hidden bg-[#d5b2a7] rounded-full">
                    {item.applicant.profile_image ? (
                      <Image
                        src={item.applicant.profile_image}
                        className="object-cover w-full h-full rounded-full"
                        width={0}
                        height={0}
                        sizes="100vw"
                        alt="profile image"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <User size={16} color="#fff" />
                      </div>
                    )}
                  </div>
                  <p>{item.applicant.nickname}</p>
                </div>

                <p className="my-2 whitespace-pre-wrap text-left text-zinc-500">
                  {item.message}
                </p>

                {statusLabel[item.status]}
              </div>
            </Link>

            {item.status === "pending" && (
              <div className="flex mt-4 gap-x-2">
                <Link
                  href={`/mypage/recruit?postId=${item.id}&companionId=${item.companion.id}&userId=${userId}`}
                  scroll={false}
                  className="bg-[#a38f86] rounded-lg w-1/2"
                >
                  <p className="text-beige py-4 text-center font-bold">수락</p>
                </Link>

                <button
                  onClick={() =>
                    rejectMutate({
                      id: item.id,
                      decided_by: userId,
                      decided_at: dayjs(),
                      companion_id: item?.companion.id,
                    })
                  }
                  className="bg-beige rounded-lg w-1/2"
                >
                  <p className="text-[#a38f86] py-4 text-center font-bold">
                    거절
                  </p>
                </button>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

StatusCard.displayName = "StatusCard";

export default function RecruitStatus() {
  const { data: userId } = useFetchUserId();
  const { data } = useApplicantsForMyPosts(userId);

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
          나의 동행 모집 현황
        </p>
      </header>

      {data && data?.length > 0 ? (
        <ul className="pt-10">
          {data?.map((item) => (
            <StatusCard key={item.id} item={item} userId={userId} />
          ))}
        </ul>
      ) : (
        <EmptyView message="아쉽게도 아직 동행 신청자가 없습니다" />
      )}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        theme="colored"
      />
    </div>
  );
}
