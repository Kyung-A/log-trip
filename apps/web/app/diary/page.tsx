import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { DiaryList, diaryQueries } from "@/features/diary";

export default async function Diary() {
  const queryClient = new QueryClient();
  const options = diaryQueries.mineList();

  await queryClient.prefetchQuery(options);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DiaryList queryKey={options.queryKey} />
    </HydrationBoundary>
  );
}
