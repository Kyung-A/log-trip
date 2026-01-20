"use client";

import { useCallback, useEffect, useState } from "react";
import { DiaryItem } from "./DiaryItem";
import {
  IDiary,
  useDeleteDiary,
  useFetchDiaries,
  useUpdateIsReport,
  useUpdateIsPublic,
} from "../..";
import { EmptyView } from "@/shared";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";

export const DiaryList = ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { data } = useFetchDiaries(queryKey);
  const { mutateAsync: deleteMutateAsync } = useDeleteDiary();
  const { mutate: updateIsPublicMutate } = useUpdateIsPublic();
  const { mutateAsync: updateIsReportMutate } = useUpdateIsReport();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleReportDiary = useCallback(
    async (id: string) => {
      if (confirm("정말 신고하시겠습니까?")) {
        const status = await updateIsReportMutate(id);
        if (status === 204) {
          toast.success("신고 처리 되었습니다.");
        }
      }
    },
    [updateIsReportMutate],
  );

  const handleDeleteDiary = useCallback(
    async (item: IDiary) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        await deleteMutateAsync(item);
      }
    },
    [deleteMutateAsync],
  );

  const handleIsPublicDiaryChange = useCallback(
    (id: string, state: boolean) => {
      updateIsPublicMutate({ id, state });
      return state;
    },
    [updateIsPublicMutate],
  );

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
          isNotFeed={queryKey[1] !== "feed"}
        />
      ))}
    </ul>
  );
};
