import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { FacultyFilterService } from '../../shared/services/faculty-filter.service';

@Injectable()
export class FacultyHeaderInterceptor implements HttpInterceptor {
  constructor(private facultyFilterService: FacultyFilterService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const facultyId = this.facultyFilterService.getFacultyId();
    
    if (facultyId) {
      // Clonar la solicitud y añadir el header
      request = request.clone({
        setHeaders: {
          'x-faculty-id': facultyId.toString()
        }
      });
    }
    
    return next.handle(request);
  }
}