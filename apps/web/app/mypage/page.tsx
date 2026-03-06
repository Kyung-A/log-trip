import { getDiaryCounter, getUserProfile } from "@/entities/user";

import { createServerClient } from "@/shared";
import { AccountSettings, UserProfileWidget } from "@/widgets/user-profile";

export default async function MyPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await getUserProfile(user?.id);
  const { data: counters } = await getDiaryCounter(user?.id);

  return (
    <UserProfileWidget isMine profile={profile} counters={counters}>
      <AccountSettings profile={profile} userId={user?.id} />
    </UserProfileWidget>
  );
}
