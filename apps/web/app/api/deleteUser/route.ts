import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const id = req.nextUrl.searchParams.get("id");

    const resp = await fetch(
      `${process.env.SUPABASE_API_ENDPOINT}/delete-user`,
      {
        method: "POST",
        body: JSON.stringify({ id }),
        headers: {
          Authorization: `Bearer ${process.env.SUPABASE_API_KEY}`,
        },
      }
    );
    return new Response(JSON.stringify(resp), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(error.message || "Server Error", { status: 500 });
  }
};
