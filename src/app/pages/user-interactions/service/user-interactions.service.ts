import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { Reward, RewardPayload } from 'src/app/shared/models/reward.model';
import { map } from 'rxjs/operators';
import { PaginatedEp } from 'src/app/shared/models/response.model';
import { UserInteraction } from 'src/app/shared/models/userInteraction.model';

type filtersPanel = {
  email: string;
  contentType: "" | 'promotion' | 'news' | 'advertisement' | 'modal' | 'button' | 'offer';
  interactionType: "" | 'view' | 'click' | 'redeem' | 'view_more' | 'contact' | 'search';
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserInteractionService {
    BASE_URL: string
    constructor(private http: HttpClient) {
      this.BASE_URL = environment.API_URL
    }

    getInteractions(page:number, perPage:number, filters: filtersPanel): Observable<PaginatedEp<UserInteraction[]>> {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('limit', perPage.toString())
        .set('sortBy', "id")
        .set('order', "DESC");
      if (filters.email) {
        params = params.set('email', filters.email);
      }
      if (filters.contentType) {
        params = params.set('contentType', filters.contentType);
      }
      if (filters.interactionType) {
        params = params.set('interactionType', filters.interactionType);
      }
      return this.http.get<PaginatedEp<UserInteraction[]>>(`${this.BASE_URL}/user-interactions/panel`, { params }).pipe(
        map(response => response || null)
      )
    }

    getInteractionsForExport(filters: filtersPanel): Observable<UserInteraction[]> {
      let params = new HttpParams()
        if (filters.email) {
          params = params.set('email', filters.email);
        }
        if (filters.contentType) {
          params = params.set('contentType', filters.contentType);
        }
        if (filters.interactionType) {
          params = params.set('interactionType', filters.interactionType);
        }
        if (filters.startDate && filters.endDate) {
          params = params.set('startDate', filters.startDate);
          params = params.set('endDate', filters.endDate);
        }
      return this.http.get<UserInteraction[]>(`${this.BASE_URL}/user-interactions/export`, { params }).pipe(
        map(response => response || [])
      )
    }
}
