"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Map,
  MapPin,
  Pencil,
  Trash,
  Users,
  VenusAndMars,
} from "lucide-react";
import Image from "next/image";
import { groupByCountry } from "@/shared";
import { useFetchUserId, useFetchUserProfile } from "@/features/auth";
import {
  useDeleteCompanion,
  useFetchCompanionDetail,
} from "@/features/companion";
import Link from "next/link";

export default function CompanionDetail() {
  const popoverRef = useRef<HTMLDivElement>(null);

  const { id } = useParams();
  const router = useRouter();

  const { data } = useFetchCompanionDetail(id as string);
  const { data: userId } = useFetchUserId();
  const { data: profile } = useFetchUserProfile(userId);
  const { mutateAsync: deleteMutateAsync } = useDeleteCompanion();

  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  const groupedRegions = useMemo(
    () => data && groupByCountry(data?.companion_regions),
    [data]
  );

  const regionItems = useMemo(() => {
    return (
      groupedRegions &&
      Object.entries(groupedRegions)?.map(
        ([countryCode, { country_name, regions }]: any) => ({
          key: countryCode,
          countryName: country_name,
          regions: regions.join(", "),
        })
      )
    );
  }, [groupedRegions]);

  const handleDeleteCompanion = useCallback(
    async (id: string) => {
      const result = await deleteMutateAsync(id);
      // if (result.status === 204) {
      //   navigation.navigate("Home", { screen: "동행" });
      // }
    },
    [deleteMutateAsync]
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <div className="w-full relative">
      <header className="bg-white max-w-3xl fixed w-full py-2 border-b border-gray-200 flex items-center justify-between px-4">
        <button
          onClick={() => router.push("/companion")}
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
          <section>
            <p className="text-base font-semibold">여행 일정</p>

            <div className="p-3 mt-2 rounded-lg bg-zinc-100 gap-y-1">
              <div className="flex items-center gap-x-2">
                <CalendarDays size={16} color="#4b5563" />
                <p className="text-gray-800">
                  {dayjs(data?.start_date).format("YY.MM.DD")} ~{" "}
                  {dayjs(data?.end_date).format("YY.MM.DD")} (
                  {dayjs(data?.end_date).diff(data?.start_date, "days")}일)
                </p>
              </div>

              <div className="flex items-center gap-x-2">
                <Map size={16} color="#4b5563" />
                <div className="flex items-center gap-x-2">
                  <p className="text-gray-800">여행 장소 :</p>
                  {regionItems?.map((v) => (
                    <p key={v.key} className="text-gray-800">
                      {v.countryName} - {v.regions}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-x-2">
                <MapPin size={16} color="#4b5563" />
                <p className="text-gray-800">만남 장소 : {data?.place}</p>
              </div>
            </div>
          </section>

          <section>
            <p className="text-base font-semibold">동행 유형</p>

            <div className="p-3 mt-2 rounded-lg bg-zinc-100 gap-y-1">
              <div className="flex items-center gap-x-2">
                <VenusAndMars name="person" size={16} color="#4b5563" />
                <p className="text-gray-800">
                  {data?.gender_preference === "R"
                    ? "무관"
                    : data?.gender_preference === "M"
                    ? "남자만"
                    : "여자만"}
                </p>
              </div>

              <div className="flex items-center gap-x-2">
                <Users size={16} color="#4b5563" />
                <p className="text-gray-800">
                  현재 인원 : {data?.accepted_count} / {data?.companion_count}
                </p>
              </div>
            </div>
          </section>

          <section className="py-6 text-gray-800 whitespace-pre-wrap">
            {data?.content}
          </section>

          <section className="p-3 rounded-lg bg-zinc-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <div className="w-12 h-12 overflow-hidden rounded-full">
                  <Image
                    src={data?.user_info.profile_image}
                    className="object-cover w-full h-full"
                    width={0}
                    height={0}
                    sizes="100vw"
                    alt="profile image"
                  />
                </div>
                <div>
                  <p className="font-semibold">{data?.user_info.nickname}</p>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {data?.user_info.gender === "female" ? "여자" : "남자"} ·{" "}
                    {data?.user_info.about}
                  </p>
                </div>
              </div>
              <ChevronRight size={24} color="#9a9a9a" />
            </div>
          </section>
        </div>
      </main>

      {userId !== data?.user_id && gender && (
        <footer className="fixed max-w-3xl bottom-0 w-full px-4 pt-4 bg-white border-t border-gray-200 pb-14">
          <Link
            href={`/companion/apply?postId=${id}&userId=${userId}`}
            scroll={false}
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
            onClick={() => handleDeleteCompanion(data?.id)}
            className="flex items-center gap-x-2 w-full px-4 py-2 text-left text-base font-semibold text-red-500"
          >
            <Trash size={20} />
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
