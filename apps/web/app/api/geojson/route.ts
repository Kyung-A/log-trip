import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiUrl = req.nextUrl.searchParams.get("api_url");
    const regionCode = req.nextUrl.searchParams.get("region_code");
    const shapeName = req.nextUrl.searchParams.get("shape_name");

    if (!apiUrl) {
      return new Response("Missing api_url", { status: 400 });
    }

    const metaResp = await fetch(apiUrl);
    const metaRes = await metaResp.json();

    const geoUrl = metaRes?.simplifiedGeometryGeoJSON;
    if (!geoUrl) {
      return new Response("GeoJSON URL 없음", { status: 400 });
    }

    const geoResp = await fetch(geoUrl);
    const geoRes = await geoResp.json();

    const features = geoRes?.features ?? [];

    const filtered = features.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (f: any) =>
        f.properties?.shapeISO === regionCode ||
        f.properties?.shapeName === shapeName,
    );

    return new Response(JSON.stringify(filtered), {
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
}
