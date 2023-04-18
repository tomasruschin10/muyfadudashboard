import { Injectable } from '@angular/core';
import { CanActivate,
         CanLoad,
         Route,
         UrlSegment,
         ActivatedRouteSnapshot,
         RouterStateSnapshot,
         UrlTree,
         Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LoggedService } from '../services/logged.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate, CanLoad {

  constructor(
    private route: Router,
    private loggedService: LoggedService
    ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.checkLogged();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.checkLogged();
  }
  async checkLogged(): Promise<boolean> {
    const token: string | null = sessionStorage.getItem('token') ?? null;
    try {
      if (token) {
        const { body } : any = await this.loggedService.isLogged(token).toPromise();
        sessionStorage.setItem('token',body?.token);
        return true;
      } else {
        this.route.navigate(['/auth/sign-in']);
        return false;
      }
    } catch (error) {
      this.route.navigate(['/auth/sign-in']);
      return false;
    }
  }
}
