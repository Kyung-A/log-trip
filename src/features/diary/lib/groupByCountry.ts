export const groupByCountry = (regions) => {
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
  }, {});
};
