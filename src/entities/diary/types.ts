export interface IDiary {
  id?: string;
  user_info?: { name: string; email: string; profile_image: string };
  user_id: string | null;
  title: string | null;
  text_content: string | null;
  drawing_content: string | null;
  is_drawing: boolean;
  travel_date: string | null;
  diary_images: string[] | { id: string; url: string }[] | null;
  diary_regions:
    | {
        code: string;
        name: string;
        country: string;
        countryName: string;
      }[]
    | {
        region_code: string;
        region_name: string;
        country_code: string;
        country_name: string;
      }[]
    | null;
}
