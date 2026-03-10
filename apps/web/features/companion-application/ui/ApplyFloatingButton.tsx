"use client";

import React, { useMemo } from "react";

import dayjs from "dayjs";
import Link from "next/link";

import { ICompanion } from "@/entities/companion";
import { IProfile } from "@/entities/user";

export const ApplyFloatingButton = React.memo(
  ({
    companionId,
    profile,
    companionData,
    myId,
  }: {
    companionId: string;
    profile: IProfile;
    companionData: ICompanion;
    myId?: string;
  }) => {
    const gender = useMemo(() => {
      if (
        companionData?.gender_preference === "F" &&
        profile?.gender === "female"
      ) {
        return true;
      } else if (
        companionData?.gender_preference === "M" &&
        profile?.gender === "male"
      ) {
        return true;
      } else if (companionData?.gender_preference === "R") {
        return true;
      } else {
        return false;
      }
    }, [companionData, profile]);

    const applied = useMemo(
      () => companionData?.applications.some((v) => v.applicant_id === myId),
      [companionData?.applications, myId],
    );

    return (
      <>
        {myId !== companionData?.user_id && gender && (
          <footer className="fixed max-w-3xl bottom-0 w-full px-4 pt-4 bg-white border-t border-gray-200 pb-14">
            <Link
              href={`/companion/apply?postId=${companionId}&userId=${myId}`}
              className={`block w-full rounded-lg ${
                dayjs().isAfter(companionData?.deadline_at) ||
                applied ||
                companionData?.is_full
                  ? "bg-gray-300 pointer-events-none"
                  : "bg-[#d5b2a7]"
              }`}
            >
              <p
                className={`py-3 font-bold text-center text-lg ${
                  dayjs().isAfter(companionData?.deadline_at) ||
                  applied ||
                  companionData?.is_full
                    ? "text-zinc-400"
                    : "text-white"
                }`}
              >
                {applied
                  ? "동행 신청 완료"
                  : companionData?.is_full
                    ? "동행 신청 마감"
                    : "동행 신청하기"}
              </p>
            </Link>
          </footer>
        )}
      </>
    );
  },
);

ApplyFloatingButton.displayName = "ApplyFloatingButton";
