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

export const DiaryList = ({ queryKey }: { queryKey: readonly unknown[] }) => {
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
    return <EmptyView message="공개된 다이어리가 없습니다" />;
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
