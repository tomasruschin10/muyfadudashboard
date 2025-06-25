import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getRewardsRequests(page: number, status?: string, startDate?: string, endDate?: string): Observable<PaginatedEp<RewardRequest[]>> {
    let params = new HttpParams()
      .set('page', page.toString());
    if (status) {
      params = params.set('status', status);
    }
    if (startDate && endDate) {
      params = params.set('startDate', startDate);
      params = params.set('endDate', endDate);
    }
    return this.http.get<PaginatedEp<RewardRequest[]>>(`${this.apiUrl}/rewards-requests`, {params}).pipe(
      map(response => response || null)
    )
  }

  getRewardsRequestsForExport(status?: string, startDate?: string, endDate?: string): Observable<RewardRequest[]> {
    let params = new HttpParams()
    if (status) {
      params = params.set('status', status);
    }
    if (startDate && endDate) {
      params = params.set('startDate', startDate);
      params = params.set('endDate', endDate);
    }
    return this.http.get<RewardRequest[]>(`${this.apiUrl}/rewards-requests/export`, { params }).pipe(
      map(response => response || null)
    )
  }

  rejectRewardRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/rewards-requests/update-status/${id}`, {
      status: RewardsRequestStatus.REJECTED
    });
  }
}

