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
  status: status;
  created_at: string;
  updated_at: string;
  decided_at: string | null;
  decided_by: string | null;
  companion: {
    title: string;
  };
}
