import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorekeeperGuard implements CanActivate {
  constructor(
    public router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let user = JSON.parse(localStorage.getItem('user'));
      if (!user || user === null) {
        this.router.navigate(['/auth/login']);
        return true
      }
      else if (user) {
        if (!Object.keys(user).length) {
          this.router.navigate(['/auth/login']);
          return true
        }
      }
      return true;
  }
  
}
