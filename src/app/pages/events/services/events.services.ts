import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Reward, RewardPayload } from 'src/app/shared/models/reward.model';
import { map } from 'rxjs/operators';
import { PaginatedEp } from 'src/app/shared/models/response.model';
import { Notification, NotificationPayload } from 'src/app/shared/models/notification.model';
import { Event, EventPayload } from 'src/app/shared/models/event.model';

@Injectable({
  providedIn: 'root'
})

export class EventService {
    BASE_URL: string
    constructor(private http: HttpClient) {
      this.BASE_URL = environment.API_URL
    }

    getAllEvents(page:number, pagesize:number): Observable<PaginatedEp<Event[]>> {
      return this.http.get<PaginatedEp<Event[]>>(`${this.BASE_URL}/events?page=${page}&per_page=${pagesize}`).pipe(
        map(response => response || null)
      )
    }

    createEvent(payload: EventPayload): Observable<Event | null> {
      return this.http.post<Event>(`${this.BASE_URL}/events/create`, payload).pipe(
        map(response => response || null)
      )
    }

    getEvent(id: number): Observable<Event | null> {
      return this.http.get<Event>(`${this.BASE_URL}/events/${id}`).pipe(
        map(response => response || null)
      )
    }

    updateEvent(payload: EventPayload, id:number): Observable<Event | null> {
      return this.http.put<Event>(`${this.BASE_URL}/events/${id}`, payload).pipe(
        map(response => response || null)
      )
    }

    // Añadir función de eliminación
    deleteEvent(id: number): Observable<any> {
      return this.http.delete<Event>(`${this.BASE_URL}/events/${id}`).pipe(
        map(response => response || null)
      )
    }
}
