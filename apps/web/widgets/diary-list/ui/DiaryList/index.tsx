"use client";

import { useCallback, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { IDiary } from "@/entities/diary";

import { deleteDiaryAction } from "@/features/diary-delete";
import {
  toggleVisibilityAction,
  updateIsReportAction,
} from "@/features/diary-update";

import { EmptyView } from "@/shared";

import { DiaryItem } from "./DiaryItem";

export const DiaryList = ({
  data,
  isNotFeed,
}: {
  data: IDiary[];
  isNotFeed: boolean;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleReportDiary = useCallback(
    async (id: string, userId: string) => {
      if (confirm("정말 신고하시겠습니까?")) {
        const { success } = await updateIsReportAction(id, userId);
        if (success) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({
                type: "REFRESH_DIARY_DATA",
              }),
            );
          }

          toast.success("신고 처리 되었습니다.");
          router.refresh();
        }
      }
    },
    [router],
  );

  const handleDeleteDiary = useCallback(
    async (item: IDiary) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        const { success } = await deleteDiaryAction(item);
        if (!success) return;

        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "REFRESH_MAP_DATA",
            }),
          );

          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "REFRESH_PUBLIC_DIARY_DATA",
            }),
          );

          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "REFRESH_MYPAGE_DATA",
            }),
          );
        }

        router.refresh();
      }
    },
    [router],
  );

  const handleIsPublicDiaryChange = useCallback(
    async (id: string, state: boolean, userId?: string) => {
      const { success } = await toggleVisibilityAction(id, state, userId);

      if (success) {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "REFRESH_PUBLIC_DIARY_DATA",
            }),
          );
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: "REFRESH_MYPAGE_DATA",
            }),
          );
        }

        router.refresh();
      }
    },
    [router],
  );

  useEffect(() => {
    window.forceRefreshMap = () => {
      if (document.visibilityState === "hidden") {
        router.refresh();
      }
    };

    return () => {
      delete window.forceRefreshMap;
    };
  }, [router]);

  if (!isMounted) {
    return <div className="w-full min-h-dvh bg-zinc-100" />;
  }

  if (!data || data?.length === 0) {
    return (
      <EmptyView
        message={
          pathname.includes("public")
            ? "공개된 일기가 없습니다\n가장 먼저 내 일기를 공개 해보세요!"
            : "작성된 일기가 없습니다"
        }
      />
    );
  }

  return (
    <ul className="w-full min-h-dvh bg-zinc-100">
      {data.map((item) => (
        <DiaryItem
          key={item.id}
          item={item}
          handleReportDiary={handleReportDiary}
          handleDeleteDiary={handleDeleteDiary}
          handleIsPublicDiaryChange={handleIsPublicDiaryChange}
          isNotFeed={isNotFeed}
        />
      ))}
    </ul>
  );
};
