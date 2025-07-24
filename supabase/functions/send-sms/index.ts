import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const apiKey = Deno.env.get("COOLSMS_API_KEY")!;
  const apiSecret = Deno.env.get("COOLSMS_API_SECRET_KEY")!;
  const fromPhoneNumber = Deno.env.get(" COOLSMS_FROM_PHONE")!;

  const timestamp = new Date().toISOString();
  const salt = generateSalt();
  const signature = await createSignature(apiSecret, timestamp, salt);

  try {
    const { phone } = await req.json();

    const res = await fetch("https://api.solapi.com/messages/v4/send", {
      method: "POST",
      headers: {
        Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${timestamp}, salt=${salt}, signature=${signature}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          to: phone,
          from: fromPhoneNumber,
          text: `[MyApp] 인증번호는 1234입니다.`,
        },
      }),
    });

    const result = await res.json();

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    return new Response(error, { status: 500 });
  }
});

function generateSalt(length = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSignature(
  apiSecret: string,
  date: string,
  salt: string
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(apiSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const data = encoder.encode(date + salt);
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);

  return toHex(signatureBuffer);
}
