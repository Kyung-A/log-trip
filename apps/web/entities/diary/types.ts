export interface IDiary {
  id?: string;
  user_info: {
    nickname: string;
    email: string;
    profile_image: string;
    about: string;
  };
  user_id: string;
  title: string | null;
  text_content: string | null;
  drawing_content: string | null;
  is_drawing: boolean;
  travel_date: Date | null;
  diary_images: { id?: string; url: string }[];
  diary_regions: IDiaryRegionsRender[];
  is_public: boolean;
  is_report: boolean;
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
