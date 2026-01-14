// supabase/functions/social-callback/index.ts

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "jsr:@std/crypto/crypto";
import { decodeBase64 } from "jsr:@std/encoding/base64";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const url = new URL(req.url);
    let provider = "";
    let providerId = "";

    // * --- 네이버 처리 ---
    const naverIdFromUrl =
      url.searchParams.get("id") || url.searchParams.get("encryptUniqueId");
    if (naverIdFromUrl) {
      provider = "naver";
      providerId = await decryptNaverId(naverIdFromUrl);
    }

    // * --- POST 바디 처리 (카카오 & 애플) ---
    if (req.method === "POST" && !providerId) {
      const rawText = await req.text();
      let payload = "";

      try {
        const parsedBody = JSON.parse(rawText);

        if (parsedBody.payload) {
          payload = parsedBody.payload;
        } else {
          const firstKey = Object.keys(parsedBody)[0];
          if (firstKey && firstKey.includes("payload")) {
            const innerJson = JSON.parse(firstKey);
            payload = innerJson.payload;
          }
        }
      } catch {
        const params = new URLSearchParams(rawText);
        payload = params.get("payload") || "";

        // * 카카오
        if (!payload) {
          const kakaoId = params.get("user_id") || params.get("referrer_uid");
          if (kakaoId) {
            provider = "kakao";
            providerId = kakaoId.toString();
          }
        }
      }

      // * 애플
      if (payload) {
        provider = "apple";
        providerId = extractAppleSub(payload);
      }
    }

    if (provider && providerId) {
      await processUserDeletion(supabase, providerId);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});

/**
 ** 네이버 이용자 식별정보 복호화
 */
async function decryptNaverId(encryptedBase64: string): Promise<string> {
  const clientSecret = Deno.env.get("NAVER_CLIENT_SECRET");
  if (!clientSecret)
    throw new Error("NAVER_CLIENT_SECRET가 설정되지 않았습니다.");

  const encoder = new TextEncoder();

  const keyHash = await crypto.subtle.digest(
    "MD5",
    encoder.encode(clientSecret)
  );
  const keyBin = new Uint8Array(keyHash);

  const base64 = encryptedBase64.replace(/-/g, "+").replace(/_/g, "/");
  const fullData = decodeBase64(base64);

  const IV_SIZE = 16;
  if (fullData.length <= IV_SIZE)
    throw new Error("데이터 길이가 너무 짧습니다.");

  const iv = fullData.slice(0, IV_SIZE);
  const encryptedContent = fullData.slice(IV_SIZE);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBin,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    cryptoKey,
    encryptedContent
  );

  return new TextDecoder().decode(decryptedBuffer).trim();
}

/**
 ** 애플 이용자 식별정보 복호화
 */
function extractAppleSub(payload: string): string {
  try {
    const parts = payload.split(".");
    const decoded = JSON.parse(
      new TextDecoder().decode(
        decodeBase64(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
      )
    );

    if (decoded.events) {
      const events =
        typeof decoded.events === "string"
          ? JSON.parse(decoded.events)
          : decoded.events;
      return events.sub || "";
    }
    return decoded.sub || "";
  } catch (e) {
    console.error("Apple JWT 파싱 실패:", e.message);
    return "";
  }
}

/**
 ** DB에서 사용자 삭제
 */
async function processUserDeletion(supabase: any, providerId: string) {
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error || !data?.users) {
    console.error("유저 목록 로드 실패:", error?.message);
    return;
  }

  const targetUser = data.users.find((u: any) => {
    const meta = u.raw_user_meta_data || u.user_metadata;
    const metaSub = meta?.sub?.toString();
    const metaProviderId = meta?.provider_id?.toString();

    return metaSub === providerId || metaProviderId === providerId;
  });

  if (targetUser) {
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      targetUser.id
    );

    if (deleteError) {
      console.error(`[삭제 에러] ${targetUser.email}:`, deleteError.message);
    } else {
      console.log(
        `[삭제 성공] 유저 ${targetUser.email}가 완전히 제거되었습니다.`
      );
    }
  } else {
    console.log(`[매칭 실패] DB에서 소셜 ID ${providerId}를 찾을 수 없습니다.`);
  }
}
