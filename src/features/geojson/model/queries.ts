import { queryOptions, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { COUNTRY_COLORS } from "@/shared";
import { getGeoFeatures } from "../api";
import { IRegion } from "@/entities/region";
import { Country, IOptionsParams } from "./types";

const regionGeoQueryOptions = (params: IOptionsParams) => {
  const { api_url, region_code, shape_name, color } = params;

  return queryOptions({
    queryKey: ["regionGeo", api_url, region_code, shape_name],
    queryFn: async () => {
      const features = await getGeoFeatures(api_url, region_code, shape_name);

      return {
        id: region_code,
        color: color,
        type: "FeatureCollection",
        features: features,
      };
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export const useFetchRegionsGeoJSON = (
  rowRegions: IRegion[],
  uniqueByCountry: Country[],
) => {
  const coloredParams = useMemo(() => {
    const allowed = rowRegions.filter((c) =>
      uniqueByCountry.some((reg) => c.region_code === reg.region_code),
    );

    return allowed.reduce((acc, c) => {
      const matched = COUNTRY_COLORS.find(
        (color) => color.country_code === c.country_code,
      );
      if (matched) {
        acc.push({ ...c, color: matched.color });
      }
      return acc;
    }, []);
  }, [rowRegions, uniqueByCountry]);

  const result = useQueries({
    queries: coloredParams.map((p) => regionGeoQueryOptions(p)),
  });

  const geoJson = useMemo(() => {
    const dedup = new Map();

    for (const r of result) {
      const value = r.data;
      if (value) dedup.set(value.id, value);
    }

    return Array.from(dedup.values());
  }, [result]);

  const isFetching = result.some((r) => r.isFetching);
  const isError = result.some((r) => r.isError);

  return { geoJson, isFetching, isError };
};
