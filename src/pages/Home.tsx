import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import MapboxGL from "@rnmapbox/maps";
import axios from "axios";
import { COUNTRY_COLORS, supabase } from "@/shared";
import { getDiaryRegions } from "@/entities/diary";
import { getUser } from "@/entities/auth";
import { IRegionResponse } from "@/entities/diary/types";
import { useFocusEffect } from "@react-navigation/native";

MapboxGL.setAccessToken(process.env.MAPBOX_KEY);

export default function HomeScreen() {
  const [geoJSON, setGeoJSON] = useState([]);

  const fetchUser = useCallback(async () => {
    const { id } = await getUser();
    return id;
  }, []);

  const fetchRegions = useCallback(async (id: string) => {
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
        f.properties.shapeISO === data.code ||
        f.properties.shapeName === data.shape_name
    );

    return {
      id: data.code,
      color: data.color,
      type: "FeatureCollection",
      features: filtered,
    };
  };

  type BatchItem = { country: string; code?: string; shapeName?: string };

  function buildOr(batch: BatchItem[], opts = { loose: true }) {
    const groups: string[] = [];
    for (const { country, code, shapeName } of batch) {
      if (code) groups.push(`and(country.eq.${country},code.eq.${code})`);
      if (shapeName) {
        const pat = opts.loose
          ? shapeName.includes("%")
            ? shapeName
            : `%${shapeName}%`
          : shapeName;
        groups.push(
          `and(country.eq.${country},shape_name.${opts.loose ? "ilike" : "eq"}.${pat})`
        );
      }
    }
    return groups.join(",");
  }

  const fetchData = useCallback(async () => {
    const userId = await fetchUser();
    const result = await fetchRegions(userId);

    const uniqueByCountry = Array.from(
      new Map(
        result.map((item: IRegionResponse) => [item.region_code, item])
      ).values()
    ).map((v) => ({
      code: v.region_code,
      shape_name: v.shape_name,
      country: v.country_code,
    }));

    const orExp = buildOr(uniqueByCountry);

    const { data } = await supabase.from("adm_regions").select("*").or(orExp);

    // console.log(data);

    const filtered = data.filter((c) =>
      uniqueByCountry.some((reg: IRegionResponse) => c.code === reg.code)
    );

    const filteredColors = filtered.reduce((acc, c) => {
      const matched = COUNTRY_COLORS.find(
        (color) => color.country === c.country
      );
      if (matched) {
        acc.push({ ...c, color: matched.color });
      }
      return acc;
    }, []);

    filteredColors.forEach(async (v) => {
      const geoJson = await fetchGeoJSON(v);

      setGeoJSON((prev) => [...prev, geoJson]);
    });
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
          minZoomLevel={2.5}
          maxZoomLevel={6.5}
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
