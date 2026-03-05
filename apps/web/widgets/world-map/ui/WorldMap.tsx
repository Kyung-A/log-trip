"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";

import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import { IGeoJson } from "@/entities/region";

import { revalidateAllData } from "@/features/world-map-viewer";

import { useMapbox } from "@/shared";
import { MapSplashScreen } from "@/widgets/splash-screen";

import "mapbox-gl/dist/mapbox-gl.css";

export function WorldMap({
  geoJson,
  userId,
}: {
  geoJson: IGeoJson[];
  userId?: string;
}) {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useMapbox(mapContainerRef);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = useCallback(() => {
    startTransition(async () => {
      await revalidateAllData(userId);
      router.refresh();
    });
  }, [router, userId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geoJson) return;

    const updateMap = () => {
      const currentStyle = map.getStyle();
      const existingRegionIds =
        currentStyle?.layers
          .filter((layer) => layer.id.startsWith("fill-region-"))
          .map((layer) => layer.id.replace("fill-region-", "")) || [];

      const newRegionIds = geoJson.map((f) => String(f.id));

      existingRegionIds.forEach((id) => {
        if (!newRegionIds.includes(id)) {
          const sourceId = `region-${id}`;
          if (map.getLayer(`fill-${sourceId}`))
            map.removeLayer(`fill-${sourceId}`);
          if (map.getLayer(`line-${sourceId}`))
            map.removeLayer(`line-${sourceId}`);
          if (map.getSource(sourceId)) map.removeSource(sourceId);
        }
      });

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

  useEffect(() => {
    window.forceRefreshMap = () => {
      handleRefresh();
    };

    return () => {
      delete window.forceRefreshMap;
    };
  }, [handleRefresh]);

  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        className="w-full h-screen relative"
      />

      {isPending && <MapSplashScreen />}

      <button
        type="button"
        onClick={handleRefresh}
        className="absolute bottom-2 z-10 right-2 p-2 bg-white rounded-lg shadow-[0px_0px_10px_-3px_rgba(0,0,0,0.4)]"
      >
        <RefreshCcw size={24} className={isPending ? "animate-spin" : ""} />
      </button>
    </>
  );
}
