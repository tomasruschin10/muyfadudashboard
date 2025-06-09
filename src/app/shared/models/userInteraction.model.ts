import { Advertisement } from "./advertisement.model";
import { IModal } from "./modal.model";
import { Notice } from "./notice.model";
import { Promotion } from "./promotion.model";
import { User } from "./user.model";

export interface UserInteraction {
  id: number;
  user_id: number;
  user: User;
  content_type: 'promotion' | 'news' | 'advertisement';
  content_id: number;
  interaction_type: 'view' | 'click' | 'redeem';
  created_at: Date;
  promotion?: Promotion;
  notice?: Notice;
  advertisement?: Advertisement;
  modal?: IModal
}