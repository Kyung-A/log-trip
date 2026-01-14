// supabase/functions/handle-apple-auth/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as djwt from "https://deno.land/x/djwt@v2.8/mod.ts";
import { decodeBase64 } from "https://deno.land/std@0.203.0/encoding/base64.ts";

async function generateAppleClientSecret() {
  const p8key = Deno.env.get("APPLE_PRIVATE_KEY") || "";
  const teamId = Deno.env.get("APPLE_TEAM_ID") || "";
  const keyId = Deno.env.get("APPLE_KEY_ID") || "";
  const clientId = Deno.env.get("APPLE_CLIENT_ID") || "";

  const pemContents = p8key
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\\n/g, "")
    .replace(/\s+/g, "")
    .trim();

  try {
    const keyData = decodeBase64(pemContents);

    const key = await crypto.subtle.importKey(
      "pkcs8",
      keyData.buffer,
      { name: "ECDSA", namedCurve: "P-256" },
      false,
      ["sign"]
    );

    return await djwt.create(
      { alg: "ES256", typ: "JWT", kid: keyId },
      {
        iss: teamId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        aud: "https://appleid.apple.com",
        sub: clientId,
      },
      key
    );
  } catch (e) {
    console.error("Key Processing Error:", e.message);
    throw new Error(`디코딩 및 JWT 생성 실패: ${e.message}`);
  }
}

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code, userId, email } = await req.json();

    if (!code || !userId) {
      return new Response(JSON.stringify({ error: "Missing code or userId" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clientSecret = await generateAppleClientSecret();
    const clientId = Deno.env.get("APPLE_CLIENT_ID")!;

    // * Apple 서버에 authorization_code를 전달하여 refresh_token 획득
    const appleResponse = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await appleResponse.json();

    if (tokenData.error) {
      console.error("Apple Token Error:", tokenData);
      return new Response(JSON.stringify({ error: tokenData.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase.from("users").upsert(
      {
        id: userId,
        email: email,
        apple_refresh_token: tokenData.refresh_token,
      },
      { onConflict: "id" }
    );

    if (dbError) {
      throw new Error(`DB Error: ${dbError.message}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
