import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req: Request) => {
  const { id } = await req.json();

  const { error } = await supabase.auth.admin.deleteUser(id);

  if (error) {
    return new Response(JSON.stringify(error.message), {
      status: 5000,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
