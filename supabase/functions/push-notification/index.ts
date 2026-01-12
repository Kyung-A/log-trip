import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const EXPO_TOKEN = Deno.env.get('EXPO_ACCESS_TOKEN') ?? '';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

function normalizePayload(payload: any) {
  const rec =
    payload?.record ??
    payload?.new ??
    payload?.data?.record ??
    payload?.data?.new ??
    payload;

  const user_id =
    rec?.user_id ?? payload?.user_id ?? rec?.userId ?? payload?.userId;
  const title = rec?.title ?? payload?.title ?? '알림';
  const body =
    rec?.body ?? payload?.body ?? payload?.message ?? '새 알림이 도착했어요';
  const data = rec?.data ?? payload?.data ?? null;

  return { user_id, title, body, data, _raw: payload };
}

serve(async req => {
  try {
    const payload = await req.json().catch(() => ({}));
    const norm = normalizePayload(payload);

    console.log('RAW Payload:', JSON.stringify(payload));
    console.log('Normalized:', JSON.stringify(norm));

    if (!norm.user_id) {
      return new Response(
        JSON.stringify({ ok: false, reason: 'no user_id in payload' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('expo_push_token')
      .eq('id', norm.user_id)
      .single();

    if (error) {
      console.error('DB error:', error);
      return new Response(
        JSON.stringify({
          ok: false,
          reason: 'db_error',
          detail: error.message,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const to = profile?.expo_push_token;
    if (!to) {
      return new Response(null, { status: 204 });
    }

    const msg = {
      to,
      title: norm.title,
      body: norm.body,
      data: norm.data ?? {},
      sound: 'default',
      priority: 'high',
    };

    const expoResp = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(EXPO_TOKEN ? { Authorization: `Bearer ${EXPO_TOKEN}` } : {}),
      },
      body: JSON.stringify(msg),
    });

    const expoJson = await expoResp.json().catch(() => ({}));
    console.log('Expo response:', expoResp.status, expoJson);

    if (!expoResp.ok) {
      return new Response(
        JSON.stringify({
          ok: false,
          reason: 'expo_error',
          status: expoResp.status,
          expo: expoJson,
        }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, delivered: true, expo: expoJson }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    console.error('Unhandled error:', e);
    return new Response(
      JSON.stringify({ ok: false, reason: 'unhandled', detail: String(e) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
});
