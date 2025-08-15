export type Subject = {
  id: number;
  name: string;
  label: string;
  info: string;
  prefix: string;
  selective: boolean;
  selectiveSubjects: string[];
  chairs: string[];
  conditions: Condition[] | null;
  url: string | null;
  subject_category_id: number;
  faculty_id: number | null;
  created_at: string;
  updated_at: string;
  subjectParent: SubjectParent[];
  opinionsCount: number;
}

export interface Condition {
  number: number;
  approvedLabel: string;
  exemptedLabel: string;
}

export interface SubjectParent {
  id: number;
  subject_id: number;
  subject_parent_id: number;
  created_at: string;
  updated_at: string;
  orCorrelative: number[] | null;
  parent: ParentSubject;
}

export type ParentSubject = Omit<Subject, 'subjectParent'>;

export type SubjectPayload = {
  name: string;
  subject_category_id: number;
  faculty_id: number | null;
  chairs: string[];
  info: string;
  label: string;
  selective: boolean;
  url: string | null;
  selectiveSubjects: string[];
  prefix: string;
  subjectParent: SubjectParentPayload[];
}

export interface SubjectParentPayload {
  subject_parent_id: number;
  orCorrelative: number[];
}