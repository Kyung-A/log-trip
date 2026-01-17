"use client";

import { useCallback, useEffect, useState } from "react";
import { DiaryItem } from "./DiaryItem";
import {
  IDiary,
  useDeleteDiary,
  useFetchDiaries,
  useUpdateIsPublicDiary,
} from "../..";
import { EmptyView } from "@/shared";
import { usePathname } from "next/navigation";

export const DiaryList = ({ queryKey }: { queryKey: readonly unknown[] }) => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const { data } = useFetchDiaries(queryKey);
  const { mutateAsync: deleteMutateAsync } = useDeleteDiary();
  const { mutate: updateMutate } = useUpdateIsPublicDiary();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleDeleteDiary = useCallback(
    async (item: IDiary) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        await deleteMutateAsync(item);
      }
    },
    [deleteMutateAsync]
  );

  const handleIsPublicDiaryChange = useCallback(
    (id: string, state: boolean) => {
      updateMutate({ id, state });
      return state;
    },
    [updateMutate]
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
          handleDeleteDiary={handleDeleteDiary}
          handleIsPublicDiaryChange={handleIsPublicDiaryChange}
          isNotFeed={queryKey[1] !== "feed"}
        />
      ))}
    </ul>
  );
};
