import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Faculty } from 'src/app/shared/models/faculty.model';

@Injectable({
  providedIn: 'root'
})

export class FacultiesService {
    BASE_URL: string
    constructor(private http: HttpClient) {
      this.BASE_URL = environment.API_URL
    }

    getAll() {
      return this.http.get<Faculty[]>(`${this.BASE_URL}/faculties`).pipe(
        map(response => response || null)
      )
    }
}
