"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

  const [cache, setCache] = useState<{
    [key: string]: { diaries: IDiary[]; page: number; hasMore: boolean };
  }>({
    diary: { diaries: [], page: 1, hasMore: true },
    community: { diaries: [], page: 1, hasMore: true },
  });

  const [isMounted, setIsMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { ref, inView } = useInView();

  const scrollPositions = useRef<{ [key: string]: number }>({});

  const currentTabKey = isNotFeed ? "diary" : "community";
  const currentTab = cache[currentTabKey];
  const currentDiaries = currentTab.diaries;
  const currentHasMore = currentTab.hasMore;

  useEffect(() => {
    setIsMounted(true);

    setCache((prev) => {
      if (prev[currentTabKey].diaries.length > 0) return prev;

      return {
        ...prev,
        [currentTabKey]: {
          diaries: data,
          page: 1,
          hasMore: data.length >= 10,
        },
      };
    });
  }, [data, currentTabKey]);

  const loadMoreDiaries = useCallback(async () => {
    const tabState = cache[currentTabKey];
    if (!tabState.hasMore || isPending) return;

    setIsPending(true);
    try {
      const nextPage = tabState.page + 1;
      const newData = isNotFeed
        ? await getDiariesAction(nextPage, userId)
        : await getPublicDiariesAction(nextPage);

      if (newData.length === 0) {
        setCache((prev) => ({
          ...prev,
          [currentTabKey]: { ...prev[currentTabKey], hasMore: false },
        }));
      } else {
        setCache((prev) => {
          const existingIds = new Set(
            prev[currentTabKey].diaries.map((d) => d.id),
          );
          const filteredNewData = newData.filter(
            (item) => !existingIds.has(item.id),
          );

          return {
            ...prev,
            [currentTabKey]: {
              diaries: [...prev[currentTabKey].diaries, ...filteredNewData],
              page: nextPage,
              hasMore: newData.length >= 10,
            },
          };
        });
      }
    } finally {
      setIsPending(false);
    }
  }, [cache, currentTabKey, isNotFeed, userId, isPending]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (inView && isMounted) {
      loadMoreDiaries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (inView && isMounted && !isPending) {
      loadMoreDiaries();
    }
  }, [inView, isMounted, isPending, loadMoreDiaries]);

  useEffect(() => {
    window.forceRefreshList = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCache({
        diary: { diaries: [], page: 1, hasMore: true },
        community: { diaries: [], page: 1, hasMore: true },
      });
      router.refresh();
    };
    return () => {
      delete window.forceRefreshList;
    };
  }, [router]);

  useEffect(() => {
    const savedPosition = scrollPositions.current[currentTabKey];
    if (savedPosition !== undefined) {
      window.scrollTo(0, savedPosition);
    }

    const handleScroll = () => {
      scrollPositions.current[currentTabKey] = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentTabKey]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router],
  );

  if (!isMounted) {
    return <div className="w-full min-h-dvh bg-zinc-100" />;
  }

  return (
    <ul className="w-full min-h-dvh bg-zinc-100">
      {currentDiaries.map((item) => (
        <DiaryItem
          key={`${currentTabKey}-${item.id}`}
          item={item}
          handleReportDiary={handleReportDiary}
          handleDeleteDiary={handleDeleteDiary}
          handleIsPublicDiaryChange={handleIsPublicDiaryChange}
          isNotFeed={isNotFeed}
          isPending={isPending}
        />
      ))}
      {currentHasMore && (
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
