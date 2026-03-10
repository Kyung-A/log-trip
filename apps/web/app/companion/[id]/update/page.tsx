import { getCompanionDetail } from "@/entities/companion";
import { getRegions } from "@/entities/region";

import { CompanionForm } from "@/features/companion";

export default async function CompanionUpdate({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const regions = await getRegions();
  const data = await getCompanionDetail(id);

  return <CompanionForm regions={regions} detailData={data} />;
}
