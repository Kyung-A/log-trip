"use client";
import { useEffect, useRef } from "react";

import mapboxgl from "mapbox-gl";

export const useMapbox = (
  containerRef: React.RefObject<HTMLDivElement | null>,
) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_KEY!;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      center: [126.978, 37.5665],
      zoom: 3,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL,
      attributionControl: false,
    });

    return () => mapRef.current?.remove();
  }, [containerRef]);

  return mapRef;
};
