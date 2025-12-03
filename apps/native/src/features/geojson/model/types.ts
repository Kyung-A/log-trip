import { IRegion } from "@/entities/region";

export type Country = {
  country_code: string;
  region_code: string;
  shape_name: string;
};

export interface IOptionsParams extends IRegion {
  color: string;
}
