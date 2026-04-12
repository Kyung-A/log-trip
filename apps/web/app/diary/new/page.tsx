import { getRegions } from "@/entities/region";

import { DiaryForm } from "@/features/diary-create";

import { createServerClient } from "@/shared";
import { AuthLayout } from "@/widgets/auth";

export default async function CreateDiary() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const regions = await getRegions();

  return (
    <AuthLayout>
      <DiaryForm userId={user?.id} regions={regions} />
    </AuthLayout>
  );
}
