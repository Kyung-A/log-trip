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
