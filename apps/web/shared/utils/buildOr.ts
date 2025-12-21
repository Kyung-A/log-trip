import { ICountry } from "@/features/region";

export const buildOr = (batch: ICountry[] | null, opts = { loose: true }) => {
  const groups: string[] = [];
  if (!batch) return null;

  for (const { country_code, region_code, shape_name } of batch) {
    if (region_code)
      groups.push(
        `and(country_code.eq.${country_code},region_code.eq.${region_code})`
      );
    if (shape_name) {
      const pat = opts.loose
        ? shape_name.includes("%")
          ? shape_name
          : `%${shape_name}%`
        : shape_name;
      groups.push(
        `and(country_code.eq.${country_code},shape_name.${
          opts.loose ? "ilike" : "eq"
        }.${pat})`
      );
    }
  }

  return groups.length ? groups.join(",") : null;
};
