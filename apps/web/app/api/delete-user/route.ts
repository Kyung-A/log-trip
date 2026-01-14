import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { id, platform } = await req.json();

    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_API_ENDPOINT}/delete-user`,
      {
        method: "POST",
        body: JSON.stringify({ id, platform }),
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_API_KEY}`,
        },
      }
    );

    const result = await resp.json();

    return new Response(JSON.stringify(result), {
      status: resp.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 에러가 발생했습니다.";
    return Response.json({ message: errorMessage }, { status: 500 });
  }
};
