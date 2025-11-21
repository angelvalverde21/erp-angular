import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivateChild {

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _base: BaseService
  ) {
    console.log("se pasa por el guard");
    console.log(this._base.storeName);
    
  }

  canActivateChild(route: ActivatedRouteSnapshot): Observable<boolean> {

    console.log('canActivateChild ejecutado');

    const store = this._base.storeName;

    if (this._auth.is_token()) {
      return of(true);
    }

    console.log('NO autenticado desde child guard');
    this._router.navigate([`/${store}/login`]);
    return of(false);
    
  }
}
