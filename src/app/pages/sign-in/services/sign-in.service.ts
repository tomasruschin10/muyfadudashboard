import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  BASE_URL: string;

  constructor( private http: HttpClient ) {
    this.BASE_URL = environment.API_URL;
  }

  login( body: any ) {
    return this.http.post(`${this.BASE_URL}/auth/login`, body).pipe(
      tap(
        data => data,
        error => error
      )
    );
  }

}
