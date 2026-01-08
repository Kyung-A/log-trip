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
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 에러가 발생했습니다.";
    return Response.json({ message: errorMessage }, { status: 500 });
  }
};
