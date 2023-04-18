import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggedService {
  BASE_URL: string;

  constructor(private http: HttpClient) {
    this.BASE_URL = environment.API_URL;
  }

  isLogged(token: string) {
    return this.http.get(`${this.BASE_URL}/auth/validate-token`, {
      observe: 'response',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }

}
