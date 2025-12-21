export interface IRegion {
  id: string;
  region_name: string;
  region_code: string;
  shape_name: string;
  country_code: string;
  country_name: string;
  api_url: string;
}

export type ICountry = {
  country_code: string;
  region_code: string;
  shape_name: string | null;
};

export interface IGeoJson {
  id: string;
  color: string;
  type: "FeatureCollection";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  features: any;
}

export interface IOptionsParams extends IRegion {
  color: string;
}
