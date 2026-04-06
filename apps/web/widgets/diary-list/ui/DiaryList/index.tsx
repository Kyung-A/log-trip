"use client";

import { useCallback, useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { toast } from "react-toastify";

import { IDiary } from "@/entities/diary";

import { deleteDiaryAction } from "@/features/diary-delete";
import {
  getDiariesAction,
  getPublicDiariesAction,
} from "@/features/diary-more-list";
import {
  toggleVisibilityAction,
  updateIsReportAction,
} from "@/features/diary-update";

import { EmptyView } from "@/shared";

import { DiaryItem } from "./DiaryItem";

export const DiaryList = ({
  data,
  isNotFeed,
  userId,
}: {
  data: IDiary[];
  isNotFeed: boolean;
  userId?: string;
}) => {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [diaries, setDiaries] = useState(data);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView();

  const loadMoreDiaries = async () => {
    const nextPage = page + 1;
    const newData = isNotFeed
      ? await getDiariesAction(nextPage, userId)
      : await getPublicDiariesAction(nextPage);

    if (newData.length === 0) {
      setHasMore(false);
    } else {
      setDiaries((prev) => [...prev, ...newData]);
      setPage(nextPage);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (inView && hasMore) {
      loadMoreDiaries();
    }
  }, [inView]);

  const handleReportDiary = useCallback(
    async (id: string, userId: string) => {
      if (isPending) return;
      if (!confirm("정말 신고하시겠습니까?")) return;

      setIsPending(true);
      try {
        const { success } = await updateIsReportAction(id, userId);
        if (success) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: "REFRESH_DIARY_DATA" }),
            );
          }
          toast.success("신고 처리 되었습니다.");
          router.refresh();
        }
      } finally {
        setIsPending(false);
      }
    },
    [router, isPending],
  );

  const handleDeleteDiary = useCallback(
    async (item: IDiary) => {
      if (isPending) return;
      if (!confirm("정말 삭제하시겠습니까?")) return;

      setIsPending(true);
      try {
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
      } finally {
        setIsPending(false);
      }
    },
    [router],
  );

  const handleIsPublicDiaryChange = useCallback(
    async (id: string, state: boolean, userId?: string) => {
      if (isPending) return;

      setIsPending(true);
      try {
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
      } finally {
        setIsPending(false);
      }
    },
    [router],
  );

  useEffect(() => {
    if (!data || data.length === 0) return;

    setDiaries((prev) => {
      if (page === 1) return data;

      const combined = [...data, ...prev];
      const uniqueMap = new Map();
      combined.forEach((item) => {
        if (!uniqueMap.has(item.id)) {
          uniqueMap.set(item.id, item);
        }
      });

      return Array.from(uniqueMap.values());
    });
  }, [data]);

  useEffect(() => {
    window.forceRefreshList = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setPage(1);
      setHasMore(true);
      router.refresh();
    };

    return () => {
      delete window.forceRefreshList;
    };
  }, [router, page]);

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
          !isNotFeed
            ? "공개된 일기가 없습니다\n가장 먼저 내 일기를 공개 해보세요!"
            : "작성된 일기가 없습니다"
        }
      />
    );
  }

  return (
    <ul className="w-full min-h-dvh bg-zinc-100">
      {diaries.map((item) => (
        <DiaryItem
          key={item.id}
          item={item}
          handleReportDiary={handleReportDiary}
          handleDeleteDiary={handleDeleteDiary}
          handleIsPublicDiaryChange={handleIsPublicDiaryChange}
          isNotFeed={isNotFeed}
          isPending={isPending}
        />
      ))}
      {hasMore && (
        <li ref={ref} className="h-10 flex items-center justify-center">
          <Image
            src="/images/loading.svg"
            alt="loading"
            width={50}
            height={0}
            sizes="100vw"
          />
        </li>
      )}
    </ul>
  );
};
