export interface IProfile {
  id: string;
  name: string;
  year_of_birth: string;
  gender: 'female' | 'male';
  phone: string;
  platform: string;
  mobile_carrier: string;
  created_at: string;
  about: string | null;
  profile_image: string | null;
  nickname: string;
  email: string;
}
