import { Reward } from "./reward.model";
import { User } from "./user.model";

export enum RewardsRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export interface RewardRequest {
  id: number;
  status: RewardsRequestStatus;
  user: User;
  reward: Reward;
  created_at: Date;
  updated_at: Date;
}

export function translateRewardRequestStatus(status: RewardsRequestStatus): string {
  switch (status) {
    case RewardsRequestStatus.PENDING:
      return 'Pendiente';
    case RewardsRequestStatus.APPROVED:
      return 'Aprobado';
    case RewardsRequestStatus.REJECTED:
      return 'Rechazado';
    default:
      return 'Desconocido';
  }
}
