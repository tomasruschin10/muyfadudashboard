import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Reward, RewardPayload } from 'src/app/shared/models/reward.model';
import { map } from 'rxjs/operators';
import { PaginatedEp } from 'src/app/shared/models/response.model';
import { IModal } from 'src/app/shared/models/modal.model';

@Injectable({
  providedIn: 'root'
})

export class ModalsService {
  BASE_URL: string
  constructor(private http: HttpClient) {
    this.BASE_URL = environment.API_URL
  }

  getAll(): Observable<IModal[]> {
    return this.http.get<IModal[]>(`${this.BASE_URL}/modals/all`).pipe(
      map(response => response || [])
    )
  }

  getOne(id: number): Observable<IModal | null> {
    return this.http.get<IModal>(`${this.BASE_URL}/modals/${id}`).pipe(
      map(response => response || null)
    )
  }

  create(payload: FormData): Observable<IModal | null> {
    return this.http.post<IModal>(`${this.BASE_URL}/modals/create`, payload).pipe(
      map(response => response || null)
    )
  }

  update(id: number, payload: FormData): Observable<IModal | null> {
    return this.http.put<IModal>(`${this.BASE_URL}/modals/${id}`, payload).pipe(
      map(response => response || null)
    )
  }

  delete(id: number): Observable<any> {
    return this.http.delete<null>(`${this.BASE_URL}/modals/${id}`).pipe(
      map(response => response || null)
    )
  }
}
