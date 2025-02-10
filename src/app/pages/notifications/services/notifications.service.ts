import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Reward, RewardPayload } from 'src/app/shared/models/reward.model';
import { map } from 'rxjs/operators';
import { PaginatedEp } from 'src/app/shared/models/response.model';
import { Notification, NotificationPayload } from 'src/app/shared/models/notification.model';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
    BASE_URL: string
    constructor(private http: HttpClient) {
      this.BASE_URL = environment.API_URL
    }

    getNotifications(page:number, pagesize:number): Observable<PaginatedEp<Notification[]>> {
      return this.http.get<PaginatedEp<Notification[]>>(`${this.BASE_URL}/push-notifications?page=${page}&per_page=${pagesize}`).pipe(
        map(response => response || null)
      )
    }

    createNotification(payload: NotificationPayload): Observable<Notification | null> {
      return this.http.post<Notification>(`${this.BASE_URL}/push-notifications/scheduled`, payload).pipe(
        map(response => response || null)
      )
    }

    // Añadir función de eliminación
    deleteNotification(id: number): Observable<any> {
      return this.http.delete<Notification>(`${this.BASE_URL}/push-notifications/${id}`).pipe(
        map(response => response || null)
      )
    }
}
