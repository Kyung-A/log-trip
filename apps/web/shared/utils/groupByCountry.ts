import { IDiaryRegionsRender } from "@/features/diary";

interface IGroupedResult {
  [key: string]: {
    country_name: string;
    regions: string[];
  };
}

export const groupByCountry = (regions: IDiaryRegionsRender[]) => {
  return regions.reduce((acc, region) => {
    const key = region.country_code;
    if (!acc[key]) {
      acc[key] = {
        country_name: region.country_name,
        regions: [],
      };
    }
    acc[key].regions.push(region.region_name);
    return acc;
  }, {} as IGroupedResult);
};
