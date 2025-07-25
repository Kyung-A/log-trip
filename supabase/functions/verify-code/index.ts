import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  const { code, phone } = await req.json();
  if (!code) {
    return new Response(JSON.stringify({ error: "인증번호는 필수입니다." }), {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("phone", phone)
    .eq("code", code)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return new Response(
      JSON.stringify({ error: "인증번호가 일치하지 않습니다" }),
      {
        status: 400,
      }
    );
  }

  const now = new Date();
  if (new Date(data.expires_at) < now) {
    return new Response(JSON.stringify({ error: "만료된 인증번호입니다." }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
