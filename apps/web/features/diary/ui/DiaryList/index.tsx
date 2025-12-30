"use client";

import { useCallback } from "react";
import { DiaryItem } from "./DiaryItem";
import { IDiary, useDeleteDiary, useFetchDiaries } from "../..";

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
