import { getRegions } from "@/entities/region";

import { PlanForm } from "@/features/plan-create";

import { AuthLayout } from "@/widgets/auth";

export default async function NewPlan() {
  const regions = await getRegions();

  return (
    <AuthLayout>
      <PlanForm regions={regions} />
    </AuthLayout>
  );
}
