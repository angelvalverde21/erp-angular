import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
// import { LogService } from '../servicios/log.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {

  private opciones = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json,text/*;q=0.99',
    }),
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // const headers = new HttpHeaders({
    //   'token-userx': 'asasdasasd'
    // });

    // const reqClone = req.clone({
    //   headers
    // });

    // const headers = new HttpHeaders({
    //   'token-usuario': 'ABC1290381902ALKSDJ1902'
    // });

    if (typeof window !== 'undefined') {
      
      const token = localStorage.getItem('access_token');

      // Combina los headers de opciones con el token de autorización
      const headers = this.opciones.headers.set(
        'Authorization',
        `Bearer ${token}`
      );

      const reqClone = req.clone({ headers });

      return next.handle(reqClone);
    } else {
      // Manejo en caso de no estar en un entorno de navegador
      return next.handle(req);
    }
  }
  
}
