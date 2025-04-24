import { User } from "./user.model";

export interface Post {
  id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  is_deleted: boolean;
  is_published: boolean;
  created_at: Date;
  updated_at: Date;
  last_activity_at: Date;
  thread_id: number;
  user_id: number;
  user: User;
  commentsTotal?: number;
  votesTotal?: number;
}

export type PayloadPost = Pick<Post, 'title' | 'content' | 'thread_id' | 'user_id' | 'is_deleted' | 'is_published'>;