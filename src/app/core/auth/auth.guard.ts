import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { DashboardService } from '../../views/dashboard/dashboard.service';
import { environment } from '../environments/environment';



@Injectable({
  providedIn: 'root',
})
export class authGuard implements CanActivate, CanActivateChild {
  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _dashboard: DashboardService
  ) {
    console.log("se pasa por el guard");
  }

  canActivate(
    _route: ActivatedRouteSnapshot
  ): Observable<boolean> | Promise<boolean> | any {
    // Luego, verifica si el usuario está autenticado
    
    console.log('Empieza el canActivate');
    // Verifica si el slug es válido
    // Primero verifica si el slugBase es válido
    return this._dashboard.isValid(environment.storeName).pipe(

      switchMap((isValid:boolean) => {
        
        console.log('switchMap');

        if (!isValid) {
          // Redirige a 404 si el slug no es válido
          this._router.navigate(['/404']);
          return of(false);
        }
        
        // Si el slug es válido, verifica si el usuario está autenticado
        return of(this._auth.estaAutenticado()).pipe(

          map(isAuthenticated => {

            if (isAuthenticated) {

              console.log('esta autenticado desde el guard');
              
              return true; // El usuario está autenticado y el slug es válido
            } else {
              console.log('no esta autenticado desde el guard');
              // Redirige al usuario si no está autenticado
              this._router.navigate(['/login']);
              return false;
            }
          }),
          catchError(err => {
            console.error('Error en la verificación', err);
            this._router.navigate(['/404']);
            return of(false); // Devuelve `false` en caso de error
          })
        );
      }),
      catchError(err => {
        console.error('Error al verificar el slug', err);
        this._router.navigate(['/404']);
        return of(false); // Devuelve `false` en caso de error
      })
    );
  }

  canActivateChild(): boolean {
    console.log('se paso por el canActivateChild');

    if (this._auth.estaAutenticado()) {
      return true;
    } else {
      this._router.navigate(['/login']);
      return false;
    }
  }
}
