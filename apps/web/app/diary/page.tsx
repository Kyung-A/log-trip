import { getDiaries } from "@/entities/diary";

import { createServerClient } from "@/shared";
import { DiaryList } from "@/widgets/diary-list";

export default async function Diary() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const data = await getDiaries(user?.id);

  return <DiaryList data={data} isNotFeed={true} />;
}
