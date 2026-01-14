import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const NAVER_INTERNAL_SECRET = Deno.env.get("NAVER_INTERNAL_SECRET");

Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { id, email, name, refreshToken } = await req.json();
    const password = `${id}_${NAVER_INTERNAL_SECRET}`;

    // *  auth 테이블에서 유저 조회
    const {
      data: { users },
    } = await supabase.auth.admin.listUsers();
    const existingUser = users.find((u) => u.email === email);

    // * auth 테이블에 유저가 없다면 => 회원가입으로 간주
    if (!existingUser) {
      const { error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        options: {
          data: {
            name: name,
            email_verified: true,
            email: email,
          },
        },
        user_metadata: {
          full_name: name,
          provider: "naver",
          naver_refresh_token: refreshToken,
        },
      });

      if (createError) throw createError;
    } else {
      await supabase.auth.admin.updateUserById(existingUser.id, {
        user_metadata: {
          naver_refresh_token: refreshToken,
        },
      });
    }

    // * users 테이블에 유저가 있는지 조회
    const { data: dbUser } = await supabase
      .from("users")
      .select("id")
      .eq("id", existingUser.id)
      .single();

    // * 세션 생성
    const { data: sessionData } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // * users 테이블에 유저가 없다면 (회원가입, 로그인이지만 입력 안한 사람) => 세션과 함께 추가정보 페이지로 이동
    if (!dbUser)
      return new Response(
        JSON.stringify({ nextPhoneAuth: true, session: sessionData.session }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );

    // * users 테이블에 유저가 있다면(로그인+추가정보 입력 완료) => 세션과 함께 메인으로 이동
    return new Response(
      JSON.stringify({ nextPhoneAuth: false, session: sessionData.session }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
