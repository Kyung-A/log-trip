import React, { useEffect, useState } from "react";
import { View } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import axios from "axios";

MapboxGL.setAccessToken(process.env.MAPBOX_KEY);

export default function HomeScreen() {
  const [geoJSON, setGeoJSON] = useState(null);

  const fetchGeoJSON = async (targetCode: string) => {
    // Step 1: 메타데이터 요청
    const metaRes = await axios.get(
      "https://www.geoboundaries.org/api/current/gbOpen/KOR/ADM1/"
    );

    const geoUrl = metaRes.data.simplifiedGeometryGeoJSON; // or gjDownloadURL
    if (!geoUrl) throw new Error("GeoJSON URL 없음");

    // Step 2: GeoJSON 가져오기
    const geoRes = await axios.get(geoUrl);
    const fullGeo = geoRes.data;

    // Step 3: 원하는 지역만 필터링 (예: KR-11 = 서울)
    const filtered = fullGeo.features.filter(
      (f) => f.properties.shapeISO === targetCode
    );

    return {
      type: "FeatureCollection",
      features: filtered,
    };
  };

  useEffect(() => {
    (async () => {
      const result = await fetchGeoJSON("KR-11"); // 서울
      console.log(result);
      setGeoJSON(result);
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        styleURL={process.env.MAPBOX_STYLE_URL}
        style={{ flex: 1 }}
      >
        <MapboxGL.Camera
          centerCoordinate={[126.978, 37.5665]}
          zoomLevel={5}
          minZoomLevel={4}
          maxZoomLevel={7}
        />
        {geoJSON && (
          <MapboxGL.ShapeSource id="region" shape={geoJSON}>
            <MapboxGL.FillLayer
              id="fill"
              style={{ fillColor: "#FF5733", fillOpacity: 0.5 }}
            />
            <MapboxGL.LineLayer
              id="outline"
              style={{ lineColor: "#C70039", lineWidth: 2 }}
            />
          </MapboxGL.ShapeSource>
        )}
      </MapboxGL.MapView>
    </View>
  );
}
