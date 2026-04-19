import { getPlan, getPlanItems } from "@/entities/plan";
import { getRegions } from "@/entities/region";

import { PlanDetailClient } from "@/widgets/plan-detail";

interface PlanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlanDetailPage({ params }: PlanDetailPageProps) {
  const { id } = await params;
  const [plan, items, regions] = await Promise.all([
    getPlan(id),
    getPlanItems(id),
    getRegions(),
  ]);

  if (!plan) return <div className="p-4 text-zinc-400">일정을 찾을 수 없습니다.</div>;

  return (
    <PlanDetailClient plan={plan} initialItems={items} regions={regions ?? []} />
  );
}
