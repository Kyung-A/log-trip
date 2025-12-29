export interface ICompanion {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  title: string;
  content: string;
  companion_count: number;
  gender_preference: string;
  deadline_at: Date;
  start_date: Date;
  end_date: Date;
  place: string;
  accepted_count: number;
  is_full: boolean;
  user_info: {
    nickname: string;
    profile_image: string;
    gender: string;
    about?: string;
  };
  companion_regions: {
    id: string;
    region_name: string;
    region_code: string;
    shape_name: string;
    country_code: string;
    country_name: string;
    api_url: string;
  }[];
  applications: {
    id: string;
    status: "pending" | "accepted" | "rejected" | "cancelled";
    message: string;
    created_at: string;
    applicant_id: string;
  }[];
}

export interface ICompanionRequest {
  id: string;
  user_id: string;
  title: string;
  content: string;
  companion_count: number;
  gender_preference: string;
  deadline_at: Date;
  start_date: Date;
  end_date: Date;
  place: string;
  companion_regions: {
    region_code: string;
    region_name: string;
    shape_name: string | null;
    country_code: string;
    country_name: string;
  }[];
}
