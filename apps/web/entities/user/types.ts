export interface IProfile {
  id: string;
  year_of_birth: string;
  gender: "female" | "male";
  platform: string;
  created_at: string;
  about: string | null;
  profile_image: string | null;
  nickname: string;
  email: string;
}

export interface IMyCounters {
  diaries_count: number;
  public_diaries_count: number;
  applied_count: number;
  received_count: number;
}

export interface IUpdateProfileData {
  userId?: string;
  profile_image: string | null;
  nickname: string | null;
  about: string | null;
}
