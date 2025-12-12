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
      (f: any) =>
        f.properties?.shapeISO === regionCode ||
        f.properties?.shapeName === shapeName
    );

    return new Response(JSON.stringify(filtered), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new Response(err.message || "Server Error", { status: 500 });
  }
}
