import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  BASE_URL: string

  constructor(private http: HttpClient){
    this.BASE_URL = environment.API_URL
  }

  getBalance(){
    return this.http.get(`${this.BASE_URL}/balance/all`, {
      observe: 'response'
    })
  }
  postBalance(form){
    return this.http.post(`${this.BASE_URL}/balance/create`, form, {
      observe: 'response'
    })
  }
  putBalance(form, id){
    return this.http.put(`${this.BASE_URL}/balance/update/${id}`, form, {
      observe: 'response'
    })
  }
  deleteBalance(id){
    return this.http.delete(`${this.BASE_URL}/balance/delete/${id}`, {
      observe: 'response'
    })
  }
}
