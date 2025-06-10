import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedEp } from 'src/app/shared/models/response.model';
import { Thread, ThreadPayload } from 'src/app/shared/models/thread.model';
import { PayloadPost, Post } from 'src/app/shared/models/post.model';
import { ActionType, PayloadActionType } from 'src/app/shared/models/actionType.model';
import { Action } from 'src/app/shared/models/action.model';
import { ActionTypeEnum } from 'src/app/shared/enums/action-type.enum';
import { UserAction } from 'src/app/shared/models/userAction.model';

@Injectable({
  providedIn: 'root'
})

export class ActionsService {
    BASE_URL: string
    constructor(private http: HttpClient) {
      this.BASE_URL = environment.API_URL
    }

    getActionTypes(): Observable<ActionType[]> {
      return this.http.get<ActionType[]>(`${this.BASE_URL}/action-types/all`).pipe(
        map(response => response || null)
      )
    }

    getActions():Observable<Action[]> {
      return this.http.get<Action[]>(`${this.BASE_URL}/actions/all`).pipe(
        map(response => response || null)
      )
    }

    getUserActions(page: number, limit:number): Observable<PaginatedEp<UserAction[]>> {
      let params = new HttpParams()
        .set("page", page.toString())
        .set("limit", limit.toString());

      return this.http.get<PaginatedEp<UserAction[]>>(`${this.BASE_URL}/user-actions/all`, { params }).pipe(
        map(response => response || null)
      )
    }

    updateActionType(payload: PayloadActionType, id:number): Observable<ActionType | null> {
      return this.http.put<ActionType>(`${this.BASE_URL}/action-types/${id}`, payload).pipe(
        map(response => response || null)
      )
    }

    createAction(typeId: number): Observable<Action | null> {
      return this.http.post<Action>(`${this.BASE_URL}/actions/create/${typeId}`, { }).pipe(
        map(response => response || null)
      )
    }
}
