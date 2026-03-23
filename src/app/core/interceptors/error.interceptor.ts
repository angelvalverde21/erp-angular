import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/views/base.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router, 
    private _base: BaseService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(

      catchError((error: HttpErrorResponse) => {

        if (error.status === 0) {
          // Error de red o backend caído
          console.error('Servidor no disponible');
        }

        switch (error.status) {

          case 401:
            // Token inválido o expirado
            console.log("Redirigiendo al login");
            console.log(this._base.storeName);

            this.router.navigate(['/', this._base.storeName, 'login']);

            break;

          case 403:
            // console.warn('No tienes permisos');
            break;

          case 404:
            // console.warn('Recurso no encontrado');
            break;

          case 422:
            // Validaciones de Laravel
            // console.warn('Errores de validación', error.error.errors);
            break;

          case 500:
            // console.error('Error interno del servidor');
            break;
        }

        // IMPORTANTE: devolver el error para que el componente pueda usarlo
        return throwError(() => error);
      })
    );
  }
}
