import { getRegions } from "@/entities/region";

import { CompanionForm } from "@/features/companion";

export default async function CreateCompanion() {
  const regions = await getRegions();

  return <CompanionForm regions={regions} />;
}
