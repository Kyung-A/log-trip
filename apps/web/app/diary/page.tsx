"use client";

import { useCallback } from "react";
import {
  DiaryList,
  IDiary,
  useDeleteDiary,
  useFetchDiaries,
} from "@/features/diary";
import { EmptyView } from "@/shared";

export default function Diary() {
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
    return <EmptyView message="나만의 여행 일기를 작성해보세요!" />;
  }

  return <DiaryList data={data} handleDeleteDiary={handleDeleteDiary} />;
}
