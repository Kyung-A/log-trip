import { queryOptions, useQueries, useQuery } from "@tanstack/react-query";
import { getRegions } from "../apis";
import { useMemo } from "react";
import { COUNTRY_COLORS } from "@/shared";
import { ICountry, IGeoJson, IOptionsParams, IRegion } from "..";

const regionQueries = {
  regions: (filters?: string | null) =>
    queryOptions<IRegion[] | null>({
      queryKey: ["regions", filters],
      queryFn: () => getRegions(filters),
      staleTime: 24 * 60 * 60 * 1000,
    }),
  geojson: (regionParams: IOptionsParams) => {
    const { api_url, region_code, shape_name, color } = regionParams;

    return queryOptions<IGeoJson>({
      queryKey: ["regionGeo", api_url, region_code, shape_name],
      queryFn: async () => {
        const params = new URLSearchParams({
          api_url,
          region_code,
          shape_name,
        });

        const resp = await fetch(`/api/geojson?${params.toString()}`);
        if (!resp.ok) throw new Error("Geo fetch failed");
        const features = await resp.json();

        return {
          id: region_code,
          color: color,
          type: "FeatureCollection",
          features: features,
        };
      },
      staleTime: 24 * 60 * 60 * 1000,
    });
  },
};

export const useFetchRegions = (filters?: string | null) => {
  return useQuery({
    ...regionQueries.regions(filters),
  });
};

export const useFetchRegionsGeoJSON = (
  rowRegions: IRegion[] | null,
  uniqueByCountry: ICountry[] | null
) => {
  const coloredParams = useMemo(() => {
    if (
      !rowRegions ||
      !rowRegions.length ||
      !uniqueByCountry ||
      !uniqueByCountry.length
    )
      return [];

    const allowed = rowRegions.filter((c) =>
      uniqueByCountry.some((reg) => c.region_code === reg.region_code)
    );

    return allowed.reduce((acc, c): IOptionsParams[] => {
      const matched = COUNTRY_COLORS.find(
        (color) => color.country_code === c.country_code
      );
      if (matched) {
        acc.push({ ...c, color: matched.color });
      }
      return acc;
    }, []);
  }, [rowRegions, uniqueByCountry]);

  const result = useQueries({
    queries: coloredParams?.map((p) => regionQueries.geojson(p)),
  });

  const geoJson = useMemo(() => {
    const dedup = new Map<string, IGeoJson>();

    for (let i = 0; i < result.length; i++) {
      const data = result[i].data;
      const color = coloredParams[i]?.color;

      if (data && color) {
        dedup.set(data.id, { ...data, color });
      }
    }

    return [...dedup.values()];
  }, [result, coloredParams]);

  const isFetching = result.some((r) => r.isFetching);
  const isError = result.some((r) => r.isError);

  return { geoJson, isFetching, isError };
};
