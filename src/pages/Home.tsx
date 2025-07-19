import React, { useEffect, useState } from "react";
import { View } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import axios from "axios";
import { COUNTRIES } from "@/constants";

MapboxGL.setAccessToken(process.env.MAPBOX_KEY);

export default function HomeScreen({ navigation }) {
  const [geoJSON, setGeoJSON] = useState(null);

  const fetchGeoJSON = async (data) => {
    const metaRes = await axios.get(data.apiURL);

    const geoUrl = metaRes.data.simplifiedGeometryGeoJSON;
    if (!geoUrl) throw new Error("GeoJSON URL 없음");

    const geoRes = await axios.get(geoUrl);
    const fullGeo = geoRes.data;

    const filtered = fullGeo.features.filter(
      (f) => f.properties.shapeISO === data.code
    );

    return {
      type: "FeatureCollection",
      features: filtered,
    };
  };

  useEffect(() => {
    (async () => {
      const result = await fetchGeoJSON(COUNTRIES[0]);
      setGeoJSON(result);
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        styleURL={process.env.MAPBOX_STYLE_URL}
        logoEnabled={false}
        attributionEnabled={false}
        style={{ flex: 1 }}
      >
        <MapboxGL.Camera
          centerCoordinate={[126.978, 37.5665]}
          zoomLevel={5}
          minZoomLevel={3}
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
