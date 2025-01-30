import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RewardRequest, RewardsRequestStatus } from 'src/app/shared/models/reward-request.model';
import { map } from 'rxjs/operators';
import { PaginatedEp } from 'src/app/shared/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class RewardRequestsService {
  private apiUrl = environment.API_URL;

  constructor(private http: HttpClient) { }

  approveRewardRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/rewards-requests/update-status/${id}`, {
      status: RewardsRequestStatus.APPROVED
    });
  }

  getRewardsRequests(page: number, status?: string): Observable<PaginatedEp<RewardRequest[]>> {
    return this.http.get<PaginatedEp<RewardRequest[]>>(`${this.apiUrl}/rewards-requests?page=${page}&status=${status || ''}`).pipe(
      map(response => response || null)
    )
  }

  rejectRewardRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/rewards-requests/update-status/${id}`, {
      status: RewardsRequestStatus.REJECTED
    });
  }
}

