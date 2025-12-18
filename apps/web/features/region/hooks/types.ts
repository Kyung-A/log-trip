export interface IRegion {
  id: string;
  region_name: string;
  region_code: string;
  shape_name: string;
  country_code: string;
  country_name: string;
  api_url: string;
}

export type BatchItem = {
  country_code: string;
  region_code?: string;
  shape_name?: string;
};

export type Country = {
  country_code: string;
  region_code: string;
  shape_name: string;
};

export interface IOptionsParams extends IRegion {
  color: string;
}
