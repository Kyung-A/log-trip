import { CompanionDetailContent, companionQueries } from "@/features/companion";
import { ApplyFloatingButton } from "@/features/companion-application/ui";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function CompanionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClinet = new QueryClient();

  await queryClinet.prefetchQuery({
    ...companionQueries.detailServer(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <CompanionDetailContent id={id} />
      <ApplyFloatingButton id={id} />
    </HydrationBoundary>
  );
}
