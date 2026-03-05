"use server";

import { unstable_cache } from "next/cache";

const fetchAndFilterGeoJson = async (
  api_url: string,
  region_code: string,
  shape_name: string,
) => {
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
  return features.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (f: any) =>
      f.properties?.shapeISO === region_code ||
      f.properties?.shapeName === shape_name,
  );
};

export const getGeoJson = async (
  api_url: string,
  region_code: string,
  shape_name: string,
) => {
  const getCachedGeoJson = unstable_cache(
    async () => fetchAndFilterGeoJson(api_url, region_code, shape_name),
    ["geojson-data", api_url, region_code, shape_name],
    {
      tags: ["geojson-data"],
      revalidate: 86400, // TODO: 24시간 동안 서버에 저장
    },
  );

  return getCachedGeoJson();
};
