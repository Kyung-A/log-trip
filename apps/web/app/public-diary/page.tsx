import { DiaryList, diaryQueries } from "@/features/diary";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

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
