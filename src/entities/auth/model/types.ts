export interface IProfile {
  id: string;
  name: string;
  birthday: string;
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
