import { AccountSettings, UserProfileWidget } from "@/widgets/user-profile";

export default async function MyPage() {
  return (
    <UserProfileWidget isMine>
      <AccountSettings />
    </UserProfileWidget>
  );
}
