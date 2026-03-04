import {
  getGeoJson,
  ICountry,
  IGeoJson,
  IOptionsParams,
  IRegion,
} from "@/entities/region";

import { buildOr, COUNTRY_COLORS, createServerClient } from "@/shared";
import { WorldMap } from "@/widgets/world-map";

export default async function WorldMapPage() {
  const supabase = await createServerClient();

  // 1. 유저 정보 및 다이어리 지역 데이터 패칭
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 유저가 없으면 로그인 페이지로 보내거나 에러 처리
    return <div>로그인이 필요합니다.</div>;
  }

  const { data: diaryRegions } = await supabase
    .from("diary_regions")
    .select(
      `
      *,
      diaries!inner(user_id)
    `,
    )
    .eq("diaries.user_id", user.id);

  // 2. 유니크한 국가/지역 추출
  const uniqueByCountry: ICountry[] = diaryRegions
    ? Array.from(
        new Map(diaryRegions.map((item) => [item.region_code, item])).values(),
      ).map((v) => ({
        region_code: v.region_code,
        shape_name: v.shape_name,
        country_code: v.country_code,
      }))
    : [];

  // 3. 필터 생성 및 adm_regions 조회
  let rowRegions: IRegion[] = [];
  const filterString = buildOr(uniqueByCountry);

  if (filterString) {
    const { data } = await supabase
      .from("adm_regions")
      .select("*")
      .or(filterString);
    rowRegions = data || [];
  }

  // 4. 서버 사이드에서 GeoJSON 데이터 병렬로 다 가져오기
  // 이 부분이 핵심입니다. Promise.all을 사용하여 서버에서 모든 fetch를 기다립니다.
  const getFullGeoJsonData = async (): Promise<IGeoJson[]> => {
    if (!rowRegions.length || !uniqueByCountry.length) return [];

    const coloredParams: IOptionsParams[] = rowRegions.reduce((acc, c) => {
      const matched = COUNTRY_COLORS.find(
        (color) => color.country_code === c.country_code,
      );
      if (matched) acc.push({ ...c, color: matched.color });
      return acc;
    }, [] as IOptionsParams[]);

    // 서버에서 API 호출을 병렬로 처리
    const geoJsonPromises = coloredParams.map(async (param) => {
      try {
        const resp = await getGeoJson(
          param.api_url,
          param.region_code,
          param.shape_name,
        );
        return {
          id: param.region_code,
          color: param.color,
          type: "FeatureCollection",
          features: resp,
        } as IGeoJson;
      } catch (err) {
        console.error(`Failed to fetch GeoJSON for ${param.region_code}:`, err);
        return null;
      }
    });

    const results = await Promise.all(geoJsonPromises);
    return results.filter((r): r is IGeoJson => r !== null);
  };

  const finalGeoJson = await getFullGeoJsonData();
  console.log("Fetched GeoJSON data:", finalGeoJson);

  // 5. 데이터를 props로 내려줍니다.
  // 이제 WorldMap 컴포넌트 내부에서 useFetch 같은 훅을 쓸 필요가 없습니다.
  return <WorldMap geoJson={finalGeoJson} />;
}
