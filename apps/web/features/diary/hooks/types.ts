export interface IDiary {
  id?: string;
  user_info: {
    name: string;
    nickname: string;
    email: string;
    profile_image: string;
  };
  user_id: string | null;
  title: string | null;
  text_content: string | null;
  drawing_content: string;
  is_drawing: boolean;
  travel_date: Date | null;
  diary_images: { id: string; url: string }[];
  diary_regions: IDiaryRegionsRender[];
}

export interface IDiaryRegionsRender {
  region_code: string;
  region_name: string;
  shape_name: string | null;
  country_code: string;
  country_name: string;
}

export interface IDiaryRegions {
  diary_id: string;
  region_code: string;
  created_at: string;
  country_code: string;
  region_name: string;
  country_name: string;
  shape_name: string | null;
  diaries: {
    user_id: string;
  };
}
