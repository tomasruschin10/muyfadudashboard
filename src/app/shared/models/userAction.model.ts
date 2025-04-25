import { Action } from "./action.model";
import { User } from "./user.model";

export interface UserAction {
  id: number;
  points_earned: number;
  user: User;
  action: Action;
  created_at: Date;
}