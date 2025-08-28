import axios from "axios";

export const getGeoFeatures = async (
  api_url: string,
  region_code: string,
  shape_name: string,
) => {
  const metaRes = await axios.get(api_url);

  const geoUrl = metaRes.data.simplifiedGeometryGeoJSON;
  if (!geoUrl) throw new Error("GeoJSON URL 없음");

  const geoRes = await axios.get(geoUrl);
  const fullGeo = geoRes.data;

  const filtered = fullGeo.features.filter(
    (f) =>
      f.properties.shapeISO === region_code ||
      f.properties.shapeName === shape_name,
  );

  return filtered;
};
