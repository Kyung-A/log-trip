"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { IDiaryRegions, useFetchDiaryRegions } from "@/features/diary";
import { useFetchUserId } from "@/features/auth";
import { buildOr } from "@/shared";
import { useFetchRegions, useFetchRegionsGeoJSON } from "@/features/region";

import "mapbox-gl/dist/mapbox-gl.css";

export default function WorldMap() {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: userId } = useFetchUserId();
  const { data: diaryRegions } = useFetchDiaryRegions(userId);

  const uniqueByCountry = useMemo(
    () =>
      Array.from(
        new Map(
          diaryRegions?.map((item: IDiaryRegions) => [
            item.region_code,
            item,
          ]) ?? []
        ).values()
      ).map((v: IDiaryRegions) => ({
        region_code: v.region_code,
        shape_name: v.shape_name,
        country_code: v.country_code,
      })),
    [diaryRegions]
  );

  const filters = useMemo(() => buildOr(uniqueByCountry), [uniqueByCountry]);
  const { data: rowRegions } = useFetchRegions(filters);
  const { geoJson } = useFetchRegionsGeoJSON(rowRegions, uniqueByCountry);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLDivElement,
      center: [126.978, 37.5665],
      zoom: 3,
      minZoom: 1,
      maxZoom: 7,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL,
      attributionControl: false,
    });

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !geoJson || geoJson.length === 0) return;
    const map = mapRef.current;

    geoJson.forEach((feature, idx) => {
      const id = `region-${feature.id}-${idx}`;

      if (map.getLayer(`fill-${id}`)) map.removeLayer(`fill-${id}`);
      if (map.getLayer(`line-${id}`)) map.removeLayer(`line-${id}`);
      if (map.getSource(id)) map.removeSource(id);

      map.addSource(id, {
        type: "geojson",
        data: feature,
      });

      map.addLayer({
        id: `fill-${id}`,
        type: "fill",
        source: id,
        paint: {
          "fill-color": feature.color,
          "fill-opacity": 0.5,
        },
      });

      map.addLayer({
        id: `line-${id}`,
        type: "line",
        source: id,
        paint: {
          "line-color": feature.color,
          "line-width": 2,
        },
      });
    });
  }, [geoJson]);

  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        className="w-full h-screen"
      />
    </>
  );
}
