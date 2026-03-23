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

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (typeof window === 'undefined') {
      return next.handle(req);
    }

    const token = localStorage.getItem('access_token');

    // 👇 solo agregamos Authorization
    let headers = req.headers;

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // 🚨 NO forzar Content-Type si es FormData
    if (!(req.body instanceof FormData)) {
      headers = headers.set(
        'Content-Type',
        'application/json; charset=utf-8'
      );
    }

    const reqClone = req.clone({ headers });

    return next.handle(reqClone);
  }
}
