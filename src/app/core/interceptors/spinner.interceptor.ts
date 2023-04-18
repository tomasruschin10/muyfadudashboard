import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpinnerService } from '../services/spinner.service';
import { finalize, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  count = 0;

  constructor(private spinner: NgxSpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      this.count++;
      const tmout = setInterval(() => {
        this.count++;

      }, 1000);
      return next.handle(req)
          .pipe ( tap (() => {
            this.spinner.show();
          }), finalize(() => {
                  clearInterval(tmout);
                  const tmout2 = setInterval(() => {
                    this.count--;
                    if ( this.count <= 0 ) {
                      this.spinner.hide();
                      clearInterval(tmout2);
                    }

                  }, 300);
              })
          );
  }
}
