import React, { useCallback, useState } from "react";
import { View } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import axios from "axios";
import { COUNTRY_COLORS, getRegions } from "@/shared";
import { getDiaryRegions } from "@/entities/diary";
import { getUser } from "@/entities/auth";
import { useFocusEffect } from "@react-navigation/native";
import { IDiaryRegions } from "@/entities/diary/types";

MapboxGL.setAccessToken(process.env.MAPBOX_KEY);

export default function HomeScreen() {
  const [geoJSON, setGeoJSON] = useState([]);

  const fetchUser = useCallback(async () => {
    const { id } = await getUser();
    return id;
  }, []);

  const fetchUserRegions = useCallback(async (id: string) => {
    const result = await getDiaryRegions(id);
    return result;
  }, []);

  const fetchGeoJSON = async (data) => {
    const metaRes = await axios.get(data.api_url);

    const geoUrl = metaRes.data.simplifiedGeometryGeoJSON;
    if (!geoUrl) throw new Error("GeoJSON URL 없음");

    const geoRes = await axios.get(geoUrl);
    const fullGeo = geoRes.data;

    const filtered = fullGeo.features.filter(
      (f) =>
        f.properties.shapeISO === data.region_code ||
        f.properties.shapeName === data.shape_name
    );

    return {
      id: data.region_code,
      color: data.color,
      type: "FeatureCollection",
      features: filtered,
    };
  };

  type BatchItem = {
    country_code: string;
    region_code?: string;
    shape_name?: string;
  };

  function buildOr(batch: BatchItem[], opts = { loose: true }) {
    const groups: string[] = [];
    for (const { country_code, region_code, shape_name } of batch) {
      if (region_code)
        groups.push(
          `and(country_code.eq.${country_code},region_code.eq.${region_code})`
        );
      if (shape_name) {
        const pat = opts.loose
          ? shape_name.includes("%")
            ? shape_name
            : `%${shape_name}%`
          : shape_name;
        groups.push(
          `and(country_code.eq.${country_code},shape_name.${opts.loose ? "ilike" : "eq"}.${pat})`
        );
      }
    }
    return groups.join(",");
  }

  const fetchData = useCallback(async () => {
    setGeoJSON([]);
    const userId = await fetchUser();
    const userRegions = await fetchUserRegions(userId);

    const uniqueByCountry = Array.from(
      new Map(
        userRegions.map((item: IDiaryRegions) => [item.region_code, item])
      ).values()
    ).map((v: IDiaryRegions) => ({
      region_code: v.region_code,
      shape_name: v.shape_name,
      country_code: v.country_code,
    }));

    const filters = buildOr(uniqueByCountry);
    const { data: rowRegions } = await getRegions(filters);

    const resultData = rowRegions.filter((c) =>
      uniqueByCountry.some((reg) => c.region_code === reg.region_code)
    );

    const mappingDataAndColor = resultData.reduce((acc, c) => {
      const matched = COUNTRY_COLORS.find(
        (color) => color.country_code === c.country_code
      );
      if (matched) {
        acc.push({ ...c, color: matched.color });
      }
      return acc;
    }, []);

    const items = await Promise.allSettled(
      mappingDataAndColor.map((v) => fetchGeoJSON(v))
    );

    const dedup = new Map();
    for (const r of items) {
      if (r.status === "fulfilled" && r.value.features.length > 0) {
        dedup.set(r.value.id, r.value);
      }
    }

    setGeoJSON(Array.from(dedup.values()));
  }, [COUNTRY_COLORS]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

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
        {geoJSON.length > 0 &&
          geoJSON.map((v, idx) => (
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
