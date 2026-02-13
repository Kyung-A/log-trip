import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { diaryQueries } from "@/entities/diary";

import { DiaryList } from "@/features/diary";

export default async function PublicDiary() {
  const queryClient = new QueryClient();
  const options = diaryQueries.feedList();

  await queryClient.prefetchQuery(options);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DiaryList queryKey={options.queryKey} />
    </HydrationBoundary>
  );
}
