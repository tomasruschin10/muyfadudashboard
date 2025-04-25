import { ActionType } from "./actionType.model";

export interface Action {
  id: number;
  type: ActionType;
}