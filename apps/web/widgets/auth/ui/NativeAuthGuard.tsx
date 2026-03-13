import { createServerClient } from "@/shared";

import { AuthBridgeClient } from ".";

export const NativeAuthGuard = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <>
      <AuthBridgeClient isAuthRequired={!user} />
      {user ? children : null}
    </>
  );
};
