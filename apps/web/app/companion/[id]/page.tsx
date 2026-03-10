import { getCompanionDetail } from "@/entities/companion";
import { getUserProfile } from "@/entities/user";

import { CompanionDetailContent } from "@/features/companion";
import { ApplyFloatingButton } from "@/features/companion-application";

import { createServerClient } from "@/shared";

export default async function CompanionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await getUserProfile(user?.id);
  const data = await getCompanionDetail(id);

  return (
    <>
      <CompanionDetailContent myId={user?.id} companionData={data} />
      <ApplyFloatingButton
        myId={user?.id}
        companionId={id}
        profile={profile}
        companionData={data}
      />
    </>
  );
}
