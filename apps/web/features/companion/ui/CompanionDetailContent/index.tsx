"use client";

import { useCallback, useState } from "react";
import { useDeleteCompanion, useFetchCompanionDetail } from "../..";
import { useFetchUserId } from "@/features/auth";
import { navigateNative, useClickOutside } from "@/shared";
import dayjs from "dayjs";
import { ChevronLeft, EllipsisVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { Itinerary } from "./Itinerary";
import { CompanionType } from "./CompanionType";
import { Writer } from "./Writer";

export const CompanionDetailContent = ({ id }: { id: string }) => {
  const { data } = useFetchCompanionDetail(id);
  const { data: userId } = useFetchUserId();
  const { mutateAsync: deleteMutateAsync } = useDeleteCompanion();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popoverRef = useClickOutside<HTMLDivElement>(() => {
    if (isOpen) setIsOpen(false);
  });

  const handleDeleteCompanion = useCallback(
    async (id: string) => {
      const status = await deleteMutateAsync(id);
      if (status === 204) {
        navigateNative("/companion");
      }
    },
    [deleteMutateAsync]
  );

  return (
    <div className="w-full relative pb-6">
      <header className="bg-white max-w-3xl fixed w-full py-2 border-b border-gray-200 flex items-center justify-between px-4">
        <button
          onClick={() => navigateNative("/companion", "WINDOW_LOCATION")}
          className="flex items-center gap-x-1"
        >
          <ChevronLeft size={22} color="#646464" />
          <span className="text-lg">뒤로</span>
        </button>
        {userId === data?.user_id && (
          <button onClick={() => setIsOpen(true)}>
            <EllipsisVertical size={22} color="#646464" />
          </button>
        )}
      </header>

      <main className="w-full pt-12 h-screen bg-white gap-y-6">
        <header className="p-4 border-b border-gray-200">
          <p className="text-xl font-semibold">{data?.title}</p>
          <p className="mt-1 text-sm text-slate-500">
            {dayjs(data?.created_at).format("YYYY-MM-DD HH:mm")} 작성
          </p>
        </header>

        <div className="flex flex-col px-4 pt-6 pb-16 gap-y-6">
          <Itinerary
            startDate={data?.start_date}
            endDate={data?.end_date}
            regions={data?.companion_regions}
            place={data?.place}
          />
          <CompanionType
            gender={data?.gender_preference}
            acceptedCount={data?.accepted_count}
            companionCount={data?.companion_count}
          />

          <div className="py-6 text-gray-800 whitespace-pre-wrap">
            {data?.content}
          </div>

          <Writer userInfo={data?.user_info} />
        </div>
      </main>

      {isOpen && (
        <div
          ref={popoverRef}
          className="absolute right-6 top-8 z-50 w-32 rounded-lg bg-white shadow-[0px_0px_20px_-1px_rgba(0,0,0,0.3)] py-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Link
            href={`/companion/${id}/update`}
            className="flex items-center gap-x-2 w-full px-4 py-2 text-left text-base font-semibold text-blue-500"
          >
            <Pencil size={20} />
            수정
          </Link>

          <button
            type="button"
            onClick={() => handleDeleteCompanion(data!.id)}
            className="flex items-center gap-x-2 w-full px-4 py-2 text-left text-base font-semibold text-red-500"
          >
            <Trash size={20} />
            삭제
          </button>
        </div>
      )}
    </div>
  );
};
