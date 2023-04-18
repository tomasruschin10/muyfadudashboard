import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

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

}
