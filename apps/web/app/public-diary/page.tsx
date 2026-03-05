import { getPublicDiaries } from "@/entities/diary";

import { DiaryList } from "@/widgets/diary-list";

export default async function PublicDiary() {
  const data = await getPublicDiaries();

  return <DiaryList data={data} isNotFeed={false} />;
}
