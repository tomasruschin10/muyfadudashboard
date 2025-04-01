import { Career } from "./career.model";

export interface Event {
  id: number;
  name: string;
  date: Date;
  description: string;
  career?: Career;
  createdAt: Date;
  updatedAt: Date;
}

export type EventPayload = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'career' > & { careerId: number | null };
