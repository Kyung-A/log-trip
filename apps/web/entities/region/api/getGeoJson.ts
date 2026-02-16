"use server";

export const getGeoJson = async (
  api_url: string,
  region_code: string,
  shape_name: string,
) => {
  try {
    if (!api_url) {
      return new Response("Missing api_url", { status: 400 });
    }

    const metaResp = await fetch(api_url);
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
        f.properties?.shapeISO === region_code ||
        f.properties?.shapeName === shape_name,
    );

    return filtered;
  } catch (error) {
    throw error;
  }
};
