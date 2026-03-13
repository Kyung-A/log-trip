import { getUserProfile } from "@/entities/user";

import { UserProfileForm } from "@/features/user-profile-update";

import { createServerClient } from "@/shared";
import { AuthLayout } from "@/widgets/auth";

export default async function ProfileUpdate() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await getUserProfile(user?.id);

  return (
    <AuthLayout>
      <UserProfileForm profile={profile} userId={user?.id} />;
    </AuthLayout>
  );
}
