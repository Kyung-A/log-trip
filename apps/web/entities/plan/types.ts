export interface ITravelPlan {
  id: string;
  user_id: string;
  title: string;
  region_names: string[];
  start_date: string; // "YYYY-MM-DD"
  end_date: string;
  created_at: string;
}

export interface IPlanItem {
  id: string;
  plan_id: string;
  day_number: number;
  title: string;
  place?: string | null;
  time: string; // "HH:mm"
  memo?: string | null;
  created_at: string;
}

export interface ICreatePlanInput {
  title: string;
  region_names: string[];
  start_date: string;
  end_date: string;
}

export interface IUpdatePlanInput {
  title?: string;
  region_names?: string[];
  start_date?: string;
  end_date?: string;
}

export interface ICreatePlanItemInput {
  plan_id: string;
  day_number: number;
  title: string;
  place?: string | null;
  time: string;
  memo?: string | null;
}

export interface IUpdatePlanItemInput {
  title?: string;
  place?: string | null;
  time?: string;
  memo?: string | null;
}
