"use client";

import { useCallback, useState } from "react";
import { DiaryItem } from "./DiaryItem";
import { IDiary, useDeleteDiary, useFetchDiaries } from "../..";

export const DiaryList = () => {
  const { data } = useFetchDiaries();
  const { mutateAsync } = useDeleteDiary();
  const [openId, setOpenId] = useState<string | null>(null);

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
          isOpen={openId === item.id}
          onToggle={() =>
            setOpenId(
              (prev) => (prev === item.id ? null : item.id) as string | null
            )
          }
          onClose={() => setOpenId(null)}
          handleDeleteDiary={handleDeleteDiary}
        />
      ))}
    </ul>
  );
};
