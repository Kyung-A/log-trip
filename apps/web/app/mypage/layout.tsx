import { AuthLayout } from "@/widgets/auth";

export default function MypageLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <AuthLayout>
      {children}
      {modal}
    </AuthLayout>
  );
}
