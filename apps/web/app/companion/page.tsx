import { getCompanions } from "@/entities/companion";

import { CompanionList } from "@/features/companion";

// TODO: 추후 추가 예정 서비스
export default async function Companion() {
  const data = await getCompanions();
  return <CompanionList data={data} />;
}
