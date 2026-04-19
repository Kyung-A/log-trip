import { IPlanItem, ITravelPlan } from "../types";

export const MOCK_PLANS: ITravelPlan[] = [
  {
    id: "mock-plan-1",
    user_id: "mock-user",
    title: "인도네시아 발리 여행",
    region_names: ["발리"],
    start_date: "2026-05-01",
    end_date: "2026-05-05",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-plan-2",
    user_id: "mock-user",
    title: "일본 도쿄 여행",
    region_names: ["도쿄"],
    start_date: "2026-06-10",
    end_date: "2026-06-15",
    created_at: new Date().toISOString(),
  },
];

export const MOCK_PLAN_ITEMS: IPlanItem[] = [
  {
    id: "mock-item-1",
    plan_id: "mock-plan-1",
    day_number: 1,
    title: "기상 및 조식",
    place: "발리 호텔",
    time: "09:00",
    memo: "조식 포함 패키지 확인",
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-item-2",
    plan_id: "mock-plan-1",
    day_number: 1,
    title: "해변 산책",
    place: "꾸따 비치",
    time: "11:00",
    memo: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "mock-item-3",
    plan_id: "mock-plan-1",
    day_number: 2,
    title: "우붓 투어",
    place: "우붓 시장",
    time: "10:00",
    memo: "기념품 쇼핑",
    created_at: new Date().toISOString(),
  },
];
