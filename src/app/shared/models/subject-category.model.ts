import { Subject } from "./subject.model";

export interface SubjectCategory {
  id: number;
  name: string;
  description: string;
  career_id: number;
  year: string;
  faculty_id: number | null;
  created_at: string;
  updated_at: string;
  subject: Subject[]
}

export type SubjectCategoryPayload = Omit<SubjectCategory, "id" | "created_at" | "updated_at" | "subject" | "year"> & { year: number}