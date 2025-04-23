import { Career } from "./career.model";
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
  career: Career | null;
}

export type ThreadPayload = Pick<Thread, 'name' | 'description' | 'is_published'> & { career_id: number | null };