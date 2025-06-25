import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedEp } from 'src/app/shared/models/response.model';
import { User, UserWithcounters } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  BASE_URL: string;

  constructor(private http: HttpClient) {
    this.BASE_URL = environment.API_URL;
  }

  getUsers(rol){
    return this.http.get(`${this.BASE_URL}/user/all/${rol}`, {
      observe: 'response'
    })
  }
  getUsersPaginated(rol:number, page:number, perPage:number, search:string, startDate?: string, endDate?: string): Observable<PaginatedEp<User[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString())
      .set('search', search);
    if (startDate && endDate) {
      params = params.set('startDate', startDate);
      params = params.set('endDate', endDate);
    }
    return this.http.get<PaginatedEp<User[]>>(`${this.BASE_URL}/user/all/${rol}`, { params }).pipe(
      map(response => response || null)
    )
  }

  getUsersForExport(rol:number, search:string, startDate?: string, endDate?: string): Observable<User[]> {
    let params = new HttpParams()
      .set('search', search);
    if (startDate && endDate) {
      params = params.set('startDate', startDate);
      params = params.set('endDate', endDate);
    }
    return this.http.get<User[]>(`${this.BASE_URL}/user/export/${rol}`, { params }).pipe(
      map(response => response || null)
    )
  }
  postUsers(form){
    return this.http.post(`${this.BASE_URL}/auth/register`, form,{
      observe: 'response'
    })
  }
  putUsers(form, id){
    return this.http.put(`${this.BASE_URL}/auth/update/${id}`, form,{
      observe: 'response'
    })
  }
  deleteUseer(id){
    return this.http.delete(`${this.BASE_URL}/auth/delete/${id}`, {
      observe: 'response'
    })
  }

  getUsersRankedBypoints(
    page:number,
    per_page:number,
    order_by: 'referralCount' | 'opinionCount' | 'rewardRequestsCount' | 'actionPoints' | 'totalPoints' | 'weeklyPoints' | 'monthlyPoints',
    order: 'DESC' | 'ASC',
    startDate?: string,
    endDate?: string
  ): Observable<PaginatedEp<UserWithcounters[]>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', per_page.toString())
      .set('orderBy', order_by)
      .set('order', order);

    if (startDate && endDate) {
      params = params.set('startDate', startDate);
      params = params.set('endDate', endDate);
    }
    return this.http.get<PaginatedEp<UserWithcounters[]>>(`${this.BASE_URL}/user/ranking/points`, { params }).pipe(
      map(response => response || null)
    )
  }

  getUsersRankedBypointsForExport(
    order_by: 'referralCount' | 'opinionCount' | 'rewardRequestsCount' | 'actionPoints' | 'totalPoints' | 'weeklyPoints' | 'monthlyPoints',
    order: 'DESC' | 'ASC',
    startDate?: string,
    endDate?: string
  ): Observable<UserWithcounters[]> {
    let params = new HttpParams()
      .set('orderBy', order_by)
      .set('order', order);
    if (startDate && endDate) {
      params = params.set('startDate', startDate);
      params = params.set('endDate', endDate);
    }
    return this.http.get<UserWithcounters[]>(`${this.BASE_URL}/user/ranking/points/export`, { params }).pipe(
      map(response => response || null)
    )
  }

}
