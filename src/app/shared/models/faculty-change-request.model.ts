import { User } from './user.model';
import { Faculty } from './faculty.model';

export type FacultyChangeStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface FacultyChangeRequest {
  id: number;
  user: User;
  currentFaculty: Faculty;
  requestedFaculty: Faculty;
  status: FacultyChangeStatus;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface FacultyChangeRequestPayload {
  requestedFacultyId: number;
  reason: string;
}

export interface FacultyChangeRejectPayload {
  reason?: string;
}

export interface FacultyChangeUpdatePayload {
  reason?: string;
}

export interface PaginatedFacultyChangeResponse {
  data: FacultyChangeRequest[];
  total: number;
  page: number;
  limit: number;
}