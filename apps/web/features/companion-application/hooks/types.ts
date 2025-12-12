import dayjs from 'dayjs';

export interface IApply {
  companion_id: string;
  applicant_id: string;
  message?: string;
}

export type status = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface IApplyStatus {
  id: string;
  companion_id: string;
  applicant_id: string;
  message: string;
  decision_message: string;
  decision_read_at: string;
  status: status;
  created_at: string;
  updated_at: string;
  decided_at: string | null;
  decided_by: string | null;
  companion: {
    title: string;
  };
}

export interface IApplicantsForMyPost {
  id: string;
  status: status;
  message: string;
  applicant_id: string;
  created_at: string;
  companion: {
    id: string;
    title: string;
  };
  applicant: {
    id: string;
    nickname: string;
    profile_image: string | null;
  };
}

export interface IAcceptCompanion {
  id: string;
  decided_by: string;
  decision_message: string;
  decided_at: dayjs.Dayjs;
  companion_id: string;
}

export interface IRejectCompanion {
  id: string;
  decided_by: string;
  decided_at: dayjs.Dayjs;
  companion_id: string;
}
