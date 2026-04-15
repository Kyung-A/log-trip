import Link from "next/link";

import { getDiaries, getPublicDiaries } from "@/entities/diary";

import { createServerClient, EmptyView } from "@/shared";
import { DiaryList } from "@/widgets/diary-list";

interface IDiaryProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Diary({ searchParams }: IDiaryProps) {
  const supabase = await createServerClient();
  const params = await searchParams;
  const currentTab = params.tab || "diary";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data =
    currentTab === "diary"
      ? await getDiaries(user?.id, 1, 10)
      : await getPublicDiaries(1, 10);

  if (data.length === 0) {
    return (
      <EmptyView
        message={
          currentTab === "community"
            ? "공개된 일기가 없습니다\n가장 먼저 내 일기를 공개 해보세요!"
            : "작성된 일기가 없습니다"
        }
      />
    );
  }

  return (
    <div>
      <header className="p-4 sticky top-0 z-30 bg-white">
        <h1 className="text-3xl font-semibold">여행</h1>
        <nav className="mt-2 flex items-center gap-x-2">
          <Link
            href="?tab=diary"
            className={`px-4 rounded-full py-0.5 text-base cursor-pointer border ${
              currentTab === "diary"
                ? "bg-[#e9dcd9] border-[#e9dcd9] text-latte font-semibold"
                : "text-zinc-500 border-zinc-300"
            }`}
            scroll={false}
          >
            일기
          </Link>
          <Link
            href="?tab=community"
            className={`px-4 rounded-full py-0.5 text-base cursor-pointer border ${
              currentTab === "community"
                ? "bg-[#e9dcd9] border-[#e9dcd9] text-latte font-semibold"
                : "text-zinc-500 border-zinc-300"
            }`}
            scroll={false}
          >
            커뮤니티
          </Link>
        </nav>
      </header>
      <DiaryList
        data={data}
        isNotFeed={currentTab === "diary" ? true : false}
        userId={user?.id}
      />
    </div>
  );
}
