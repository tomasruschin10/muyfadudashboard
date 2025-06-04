import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Reward, RewardPayload } from 'src/app/shared/models/reward.model';
import { map } from 'rxjs/operators';
import { PaginatedEp } from 'src/app/shared/models/response.model';
import { Promotion } from 'src/app/shared/models/promotion.model';

@Injectable({
  providedIn: 'root'
})

export class PromotionService {
  BASE_URL: string
  constructor(private http: HttpClient) {
    this.BASE_URL = environment.API_URL
  }

  createPromotion(form: FormData): Observable<Promotion[]> {
    return this.http.post<Promotion[]>(`${this.BASE_URL}/promotions/create`, form).pipe(
      map((res) => res || [])
    );
  }

  getAllPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.BASE_URL}/promotions/all`).pipe(
      map((res) => res || [])
    )
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.BASE_URL}/promotions/${id}`).pipe(
      map((res) => res || null)
    )
  }

  updatePromotion(id: number, form: FormData): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.BASE_URL}/promotions/${id}`, form).pipe(
      map((res) => res || null)
    )
  }

  deletePromotion(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/promotions/${id}`).pipe(
      map((res) => res || null)
    )
  }
}
