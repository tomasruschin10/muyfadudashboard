import { ActionTypeEnum } from "../enums/action-type.enum";

export interface ActionType {
  id: number;
  type: ActionTypeEnum;
  name: string;
  description: string;
  points: number;
  is_active: boolean;
}

export type PayloadActionType = Omit<ActionType, 'id' | 'type' >;