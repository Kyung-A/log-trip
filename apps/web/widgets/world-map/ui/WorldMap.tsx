"use client";

import { useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import { useFetchUserId } from "@/entities/user";

import { useWorldMapData } from "@/features/world-map-viewer";

import { useMapbox } from "@/shared";
import { MapSplashScreen } from "@/widgets/splash-screen";

import "mapbox-gl/dist/mapbox-gl.css";

export function WorldMap() {
  const router = useRouter();
  const qc = useQueryClient();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useMapbox(mapContainerRef);

  const { data: userId } = useFetchUserId();
  const { geoJson, isFetching } = useWorldMapData(userId);

  const handleRefresh = async () => {
    await qc.resetQueries({ queryKey: ["user"] });
    await qc.resetQueries({ queryKey: ["diary"] });
    router.refresh();
  };

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
  }, [geoJson, mapRef]);

  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        className="w-full h-screen relative"
      />

      {isFetching && <MapSplashScreen />}

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
