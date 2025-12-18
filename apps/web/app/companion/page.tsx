"use client";

import { CompanionCard, useFetchCompanions } from "@/features/companion";
import { EmptyView } from "@/shared";

export default function Companion() {
  const { data } = useFetchCompanions();

  if (!data || data?.length === 0) {
    return <EmptyView message="지금 바로 동행 모집하는 글을 작성해보세요!" />;
  }

  return (
    <ul className="w-full h-full bg-zinc-100">
      {data?.map((item) => (
        <CompanionCard key={item.id} item={item} />
      ))}
    </ul>
  );
}
