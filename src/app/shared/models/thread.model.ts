import { User } from "./user.model";

export interface Thread {
  id: number;
  name: string;
  description?: string | null;
  moderator_id: number | null;
  postTotal?: number;
  created_at: Date;
  updated_at: Date;
  is_published: boolean;
  user: User;
}