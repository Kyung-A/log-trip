"use client";

import { useCallback } from "react";
import { DiaryItem } from "./DiaryItem";
import { IDiary, useDeleteDiary, useFetchDiaries } from "../..";
import { EmptyView } from "@/shared";

export const DiaryList = () => {
  const { data } = useFetchDiaries();
  const { mutateAsync } = useDeleteDiary();

  const handleDeleteDiary = useCallback(
    async (item: IDiary) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        await mutateAsync(item);
      }
    },
    [mutateAsync]
  );

  if (!data || data?.length === 0) {
    return <EmptyView message="지금 바로 여행 일기를 작성해보세요!" />;
  }

  return (
    <ul className="w-full bg-zinc-100">
      {data.map((item) => (
        <DiaryItem
          key={item.id}
          item={item}
          handleDeleteDiary={handleDeleteDiary}
        />
      ))}
    </ul>
  );
};
