import { NativeAuthGuard } from ".";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <NativeAuthGuard>{children}</NativeAuthGuard>;
};
