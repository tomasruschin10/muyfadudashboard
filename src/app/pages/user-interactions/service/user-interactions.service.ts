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
  contentType: "" | "promotion" | "news" | "advertisement";
  interactionType: "" | "view" | "click" | "redeem";
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
        .set('limit', perPage.toString());
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
}
