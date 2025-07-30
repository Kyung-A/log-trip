import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  create,
  getNumericDate,
  Header,
  Payload,
} from "https://deno.land/x/djwt@v3.0.1/mod.ts";

Deno.serve(async (req) => {
  const { name } = await req.json();
  const data = {
    message: `Hello ${name}!`,
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
