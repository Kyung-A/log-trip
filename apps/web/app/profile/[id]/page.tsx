import { getDiaryCounter, getUserProfile } from "@/entities/user";

import { AuthLayout } from "@/widgets/auth";
import { UserProfileWidget } from "@/widgets/user-profile";

export default async function UserProfile({
  params,
}: {
  params: { id: string };
}) {
  const userId = (await params).id;
  const { data: profile } = await getUserProfile(userId);
  const { data: counters } = await getDiaryCounter(userId);

  return (
    <AuthLayout>
      <UserProfileWidget profile={profile} counters={counters} />;
    </AuthLayout>
  );
}
