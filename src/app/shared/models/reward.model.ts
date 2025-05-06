export interface Reward {
  id: number;
  name: string;
  description: string;
  points_to_be_claimed: number;
  amount: number;
  amount_available: number;
}

export type RewardPayload = Omit<Reward, 'id'>;