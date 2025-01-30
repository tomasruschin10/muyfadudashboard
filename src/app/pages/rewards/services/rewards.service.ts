import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Reward, RewardPayload } from 'src/app/shared/models/reward.model';
import { map } from 'rxjs/operators';
import { PaginatedEp } from 'src/app/shared/models/response.model';

@Injectable({
  providedIn: 'root'
})

export class AdPageService {
    BASE_URL: string
    constructor(private http: HttpClient) {
      this.BASE_URL = environment.API_URL
    }

    getRewards(page:number, perPage:number): Observable<PaginatedEp<Reward[]>> {
      return this.http.get<PaginatedEp<Reward[]>>(`${this.BASE_URL}/rewards?page${page}&per_page${perPage}`).pipe(
        map(response => response || null)
      )
    }

    getReward(id: number): Observable<Reward | null> {
      return this.http.get<Reward>(`${this.BASE_URL}/rewards/${id}`).pipe(
        map(response => response || null)
      )
    }

    createReward(payload: RewardPayload): Observable<Reward | null> {
      return this.http.post<Reward>(`${this.BASE_URL}/rewards/create`, payload).pipe(
        map(response => response || null)
      )
    }

    updateReward(payload: RewardPayload, id:number): Observable<Reward | null> {
      return this.http.put<Reward>(`${this.BASE_URL}/rewards/update/${id}`, payload).pipe(
        map(response => response || null)
      )
    }

    deleteReward(id:number): Observable<any> {
      return this.http.delete<Reward>(`${this.BASE_URL}/rewards/delete/${id}`).pipe(
        map(response => response || null)
      )
    }
}
