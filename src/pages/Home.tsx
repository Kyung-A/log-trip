import React, { useMemo } from "react";
import { View } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import { IDiaryRegions, useFetchDiaryRegions } from "@/entities/diary";
import { useFetchUserId } from "@/entities/auth";
import { buildOr, useFetchRegions } from "@/entities/region";
import { useFetchRegionsGeoJSON } from "@/features/geojson";

MapboxGL.setAccessToken(process.env.MAPBOX_KEY);

export default function HomeScreen() {
  const { data: userId } = useFetchUserId();
  const { data: diaryRegions } = useFetchDiaryRegions(userId);

  const uniqueByCountry = useMemo(
    () =>
      Array.from(
        new Map(
          diaryRegions?.map((item: IDiaryRegions) => [item.region_code, item]),
        ).values(),
      ).map((v: IDiaryRegions) => ({
        region_code: v.region_code,
        shape_name: v.shape_name,
        country_code: v.country_code,
      })),
    [diaryRegions],
  );
  const filters = useMemo(() => buildOr(uniqueByCountry), [uniqueByCountry]);
  const { data: rowRegions } = useFetchRegions(filters);
  const { geoJson } = useFetchRegionsGeoJSON(rowRegions, uniqueByCountry);

  return (
    <View style={{ flex: 1 }}>
      <MapboxGL.MapView
        styleURL={process.env.MAPBOX_STYLE_URL}
        logoEnabled={false}
        attributionEnabled={false}
        style={{ flex: 1 }}
      >
        <MapboxGL.Camera
          defaultSettings={{
            centerCoordinate: [127.7669, 35.9078],
            zoomLevel: 3,
          }}
          centerCoordinate={[126.978, 37.5665]}
          minZoomLevel={1}
          maxZoomLevel={7}
        />
        {geoJson.length > 0 &&
          geoJson.map((v, idx) => (
            <MapboxGL.ShapeSource
              key={`region-${v.id}-${idx}`}
              id={`region-${v.id}-${idx}`}
              shape={v}
            >
              <MapboxGL.FillLayer
                id={`fill-${v.id}-${idx}`}
                style={{ fillColor: v.color, fillOpacity: 0.5 }}
              />
              <MapboxGL.LineLayer
                id={`outline-${v.id}-${idx}`}
                style={{ lineColor: v.color, lineWidth: 2 }}
              />
            </MapboxGL.ShapeSource>
          ))}
      </MapboxGL.MapView>
    </View>
  );
}
