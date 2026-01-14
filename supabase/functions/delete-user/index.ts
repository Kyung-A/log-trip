import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import * as djwt from "https://deno.land/x/djwt@v2.8/mod.ts";
import { decodeBase64 } from "https://deno.land/std@0.203.0/encoding/base64.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);
const KAKAO_ADMIN_KEY = Deno.env.get("KAKAO_ADMIN_KEY");

// * --- Apple 연동 해제 관련 로직 ---
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
  } catch (e: any) {
    throw new Error(`Apple Secret 생성 실패: ${e.message}`);
  }
}

async function revokeApple(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("apple_refresh_token")
    .eq("id", userId)
    .single();

  if (error || !data?.apple_refresh_token) {
    console.warn("Apple 리프레시 토큰이 없어 Revoke 과정을 건너뜁니다.");
    return;
  }

  const clientSecret = await generateAppleClientSecret();

  const response = await fetch("https://appleid.apple.com/auth/revoke", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: Deno.env.get("APPLE_CLIENT_ID")!,
      client_secret: clientSecret,
      token: data.apple_refresh_token,
      token_type_hint: "refresh_token",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Apple Revoke API 에러:", errText);
  }
}

// * --- Kakao 연동 해제 관련 로직 ---
async function getKakaoProviderId(id: string) {
  const { data: userData, error: userError } =
    await supabase.auth.admin.getUserById(id);
  if (userError || !userData.user) throw new Error("유저를 찾을 수 없습니다.");

  const kakaoIdentity = userData.user.identities?.find(
    (id) => id.provider === "kakao"
  );

  if (!kakaoIdentity) throw new Error("카카오 연동 정보를 찾을 수 없습니다.");
  return kakaoIdentity.id;
}

async function unlinkKakao(providerId: string) {
  const response = await fetch("https://kapi.kakao.com/v1/user/unlink", {
    method: "POST",
    headers: {
      Authorization: `KakaoAK ${KAKAO_ADMIN_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams({
      target_id_type: "user_id",
      target_id: providerId,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Kakao Unlink 에러:", errText);
  }
}

// * --- Naver 연동 해제 관련 로직 ---
async function revokeNaver(refreshToken: string) {
  try {
    const naverClientId = Deno.env.get("NAVER_CLIENT_ID");
    const naverClientSecret = Deno.env.get("NAVER_CLIENT_SECRET");

    const tokenParams = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: naverClientId!,
      client_secret: naverClientSecret!,
      refresh_token: refreshToken,
    });

    const tokenResp = await fetch(
      `https://nid.naver.com/oauth2.0/token?${tokenParams.toString()}`
    );
    const tokenData = await tokenResp.json();

    if (!tokenData.access_token) {
      console.error("토큰 갱신 실패:", tokenData);
      return;
    }
    const newAccessToken = tokenData.access_token;

    const revokeParams = new URLSearchParams({
      grant_type: "delete",
      client_id: naverClientId!,
      client_secret: naverClientSecret!,
      access_token: newAccessToken,
    });

    const revokeUrl = `https://nid.naver.com/oauth2.0/token?${revokeParams.toString()}`;

    const revokeResp = await fetch(revokeUrl, { method: "GET" });
    const revokeData = await revokeResp.json();

    if (revokeData.result === "success") {
      console.log("✅ 네이버 연동 해제 최종 성공:", revokeData);
    } else {
      console.error("❌ 네이버 연동 해제 최종 실패:", revokeData);
    }
  } catch (e) {
    console.error("revokeNaver 함수 실행 중 예외 발생:", e);
  }
}

// * --- 메인 핸들러 ---
Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const { id, platform } = await req.json();

    if (!id || !platform) {
      throw new Error("id와 platform 파라미터가 필요합니다.");
    }

    try {
      if (platform === "kakao") {
        const kakaoProviderId = await getKakaoProviderId(id);
        await unlinkKakao(kakaoProviderId);
      } else if (platform === "naver") {
        const {
          data: { user },
        } = await supabase.auth.admin.getUserById(id);

        const refreshToken = user?.user_metadata?.naver_refresh_token;
        if (refreshToken) await revokeNaver(refreshToken);
      } else if (platform === "apple") {
        await revokeApple(id);
      }
    } catch (socialError) {
      console.error("소셜 연동 해제 실패(무시하고 진행):", socialError.message);
    }

    // * Supabase Auth 유저 삭제 (DB의 users 테이블은 Cascade 설정에 의해 자동 삭제됨)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(id);
    if (deleteError) throw deleteError;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Withdrawal Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
