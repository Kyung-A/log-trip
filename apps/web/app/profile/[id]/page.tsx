import { UserProfileWidget } from "@/widgets/user-profile";

export default async function UserProfile({
  params,
}: {
  params: { id: string };
}) {
  const targetId = (await params).id;
  return <UserProfileWidget targetId={targetId} />;
}
