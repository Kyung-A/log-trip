import { useMemo } from "react";

import { useFetchDiaryRegions } from "@/entities/diary";
import { useFetchRegions, useFetchRegionsGeoJSON } from "@/entities/region";

import { buildOr } from "@/shared";

export const useWorldMapData = (userId?: string) => {
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

  return { geoJson, isFetching };
};
