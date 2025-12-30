"use client";

import { useFetchUserId, useFetchUserProfile } from "@/features/auth";
import { useFetchCompanionDetail } from "@/features/companion";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useMemo } from "react";

export const ApplyFloatingButton = React.memo(({ id }: { id: string }) => {
  const { data } = useFetchCompanionDetail(id);
  const { data: userId } = useFetchUserId();
  const { data: profile } = useFetchUserProfile(userId);

  const gender = useMemo(() => {
    if (data?.gender_preference === "F" && profile?.gender === "female") {
      return true;
    } else if (data?.gender_preference === "M" && profile?.gender === "male") {
      return true;
    } else if (data?.gender_preference === "R") {
      return true;
    } else {
      return false;
    }
  }, [data, profile]);

  const applied = useMemo(
    () => data?.applications.some((v) => v.applicant_id === userId),
    [data?.applications, userId]
  );

  return (
    <>
      {userId !== data?.user_id && gender && (
        <footer className="fixed max-w-3xl bottom-0 w-full px-4 pt-4 bg-white border-t border-gray-200 pb-14">
          <Link
            href={`/companion/apply?postId=${id}&userId=${userId}`}
            className={`block w-full rounded-lg ${
              dayjs().isAfter(data?.deadline_at) || applied || data?.is_full
                ? "bg-gray-300 pointer-events-none"
                : "bg-[#d5b2a7]"
            }`}
          >
            <p
              className={`py-3 font-bold text-center text-lg ${
                dayjs().isAfter(data?.deadline_at) || applied || data?.is_full
                  ? "text-zinc-400"
                  : "text-white"
              }`}
            >
              {applied
                ? "동행 신청 완료"
                : data?.is_full
                ? "동행 신청 마감"
                : "동행 신청하기"}
            </p>
          </Link>
        </footer>
      )}
    </>
  );
});

ApplyFloatingButton.displayName = "ApplyFloatingButton";
