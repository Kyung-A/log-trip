import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface IPlanProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Plan({ searchParams }: IPlanProps) {
  const params = await searchParams;
  const currentTab = params.tab || "all";

  return (
    <div className="bg-beige min-h-screen w-full overflow-hidden">
      <header className="p-4 sticky top-0 z-30 bg-white">
        <h1 className="text-3xl font-semibold">여행 일정</h1>
        <nav className="mt-2 flex items-center gap-x-2 flex-nowrap overflow-x-auto">
          <Link
            href="?tab=all"
            className={`px-4 rounded-full py-0.5 text-base cursor-pointer border shrink-0 ${
              currentTab === "all"
                ? "bg-[#e9dcd9] border-[#e9dcd9] text-latte font-semibold"
                : "text-zinc-500 border-zinc-300"
            }`}
            scroll={false}
          >
            전체
          </Link>
          <Link
            href="?tab=ing"
            className={`px-4 rounded-full py-0.5 text-base cursor-pointer border shrink-0 ${
              currentTab === "ing"
                ? "bg-[#e9dcd9] border-[#e9dcd9] text-latte font-semibold"
                : "text-zinc-500 border-zinc-300"
            }`}
            scroll={false}
          >
            진행중인 여행
          </Link>
          <Link
            href="?tab=early"
            className={`px-4 rounded-full py-0.5 text-base cursor-pointer border shrink-0 ${
              currentTab === "early"
                ? "bg-[#e9dcd9] border-[#e9dcd9] text-latte font-semibold"
                : "text-zinc-500 border-zinc-300"
            }`}
            scroll={false}
          >
            예정
          </Link>
          <Link
            href="?tab=end"
            className={`px-4 rounded-full py-0.5 text-base cursor-pointer border shrink-0 ${
              currentTab === "end"
                ? "bg-[#e9dcd9] border-[#e9dcd9] text-latte font-semibold"
                : "text-zinc-500 border-zinc-300"
            }`}
            scroll={false}
          >
            지난 여행
          </Link>
        </nav>
      </header>
      <ul className="w-full p-4 flex flex-col gap-y-4">
        {[1, 2, 3, 4, 5].map((day) => (
          <li key={day} className="px-8 py-4 bg-white rounded-full">
            <Link
              href={`/plan/${day}`}
              className="flex items-center justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold">인도네시아 발리 여행</h2>
                <p className="text-sm text-zinc-500">
                  2023년 5월 15일 - 2023년 5월 20일
                </p>
              </div>
              <ChevronRightIcon size={26} color="#d4d4d8" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
