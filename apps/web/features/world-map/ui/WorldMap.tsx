"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useMemo, useRef } from "react";
import { useFetchDiaryRegions } from "@/features/diary";
import { useFetchUserId } from "@/features/auth";
import { buildOr } from "@/shared";
import { useFetchRegions, useFetchRegionsGeoJSON } from "@/features/region";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import "mapbox-gl/dist/mapbox-gl.css";

export function WorldMap() {
  const router = useRouter();
  const qc = useQueryClient();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const { data: userId } = useFetchUserId();
  const { data: diaryRegions } = useFetchDiaryRegions(userId);

  const uniqueByCountry = useMemo(() => {
    if (!diaryRegions) return null;
    return Array.from(
      new Map(diaryRegions.map((item) => [item.region_code, item])).values(),
    ).map((v) => ({
      region_code: v.region_code,
      shape_name: v.shape_name,
      country_code: v.country_code,
    }));
  }, [diaryRegions]);

  const filters = useMemo(() => buildOr(uniqueByCountry), [uniqueByCountry]);
  const { data: rowRegions = null } = useFetchRegions(filters);
  const { geoJson, isFetching } = useFetchRegionsGeoJSON(
    rowRegions,
    uniqueByCountry,
  );

  const handleRefresh = async () => {
    await qc.resetQueries({ queryKey: ["user"] });
    await qc.resetQueries({ queryKey: ["diary"] });
    router.refresh();
  };

  useEffect(() => {
    if (typeof window === "undefined" || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY as string;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [126.978, 37.5665],
      zoom: 3,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL,
      attributionControl: false,
    });

    return () => mapRef.current?.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoJson) return;

    const updateMap = () => {
      geoJson.forEach((feature) => {
        const id = `region-${feature.id}`;
        const source = map.getSource(id) as mapboxgl.GeoJSONSource;
        if (!source) {
          map.addSource(id, { type: "geojson", data: feature });
          map.addLayer({
            id: `fill-${id}`,
            type: "fill",
            source: id,
            paint: {
              "fill-color": feature.color || "#cccccc",
              "fill-opacity": 0.5,
            },
          });
          map.addLayer({
            id: `line-${id}`,
            type: "line",
            source: id,
            paint: {
              "line-color": feature.color || "#aaaaaa",
              "line-width": 2,
            },
          });
        } else {
          source.setData(feature);
        }
      });
    };
    if (map.isStyleLoaded()) updateMap();
    else map.once("style.load", updateMap);
  }, [geoJson]);

  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        className="w-full h-screen relative"
      />

      {isFetching && (
        <div className="absolute top-0 w-full h-screen left-0 bg-transparent">
          <p className="backdrop-blur-xs bg-white/20 w-full h-full flex items-center justify-center text-lg font-semibold">
            지도를 불러오는 중...
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleRefresh}
        className="absolute bottom-2 z-10 right-2 p-2 bg-white rounded-lg shadow-[0px_0px_10px_-3px_rgba(0,0,0,0.4)]"
      >
        <RefreshCcw size={24} className={isFetching ? "animate-spin" : ""} />
      </button>
    </>
  );
}
