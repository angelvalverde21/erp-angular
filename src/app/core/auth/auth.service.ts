import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationCancel, Router } from '@angular/router';
import { map } from 'rxjs';
// import { LogService } from './log.service';

import { User } from '../../interfaces/user.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.apiPublic;
  userToken: string = '';
  roles: any;
  is_auth = false;

  private opciones = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json,text/*;q=0.99',
    }),
  };

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationCancel) {
        console.warn('❌ Navegación cancelada a', event.url);
        console.warn('ℹ️ Motivo:', event.reason);
      }
    });

  }

  logout() {
    
    localStorage.setItem('access_token', '');
    localStorage.setItem('roles', '');
    localStorage.setItem('user', '');
    // localStorage.setItem('store', '');
    // const prefix = environment.showStoreNameInSlug ? ['/', environment.storeName, 'products'] : [];
    console.log('redireccionando a /login');

    return this.router.navigateByUrl('/login').then(
      (success) => {
        if (success) {
          console.log('✅ Navegación a /login exitosa');
        } else {
          console.warn('⚠️ Navegación a /login fallida');
        }
      },
      (error) => {
        console.error('❌ Error navegando a /login:', error);
      }
    );
  }

  user() {
    return JSON.parse(localStorage.getItem('user')!);
  }

  login(user: User) {

    console.log(this.baseUrl + '/login');

    return this.http
      .post(
        this.baseUrl + '/' + environment.storeName + '/login',
        user,
        this.opciones
      )
      .pipe(
        map((resp: any) => {
          // this._console.log('entro al RXJS');

          console.log(resp);

          const obj = resp.data;

          this.setLogin(obj.access_token, obj.user, obj.store);
          // this.guardarToken(resp.data.access_token);

          this.is_auth = true;

          return resp;
        })
      );
  }

  setLogin(token: string, user: {}, store: any) {

    this.guardarToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('store', JSON.stringify(store));
    localStorage.setItem('slug_base', store.slug);

  }

  isAuth(){
    return this.is_auth;
  }
  // user() {
  //   return this.http.get(this.baseUrl + '/user', this.opciones);
  // }

  private guardarToken(token: string) {
    this.userToken = token;
    localStorage.setItem('access_token', token);
  }

  leerToken() {
    if (localStorage.getItem('access_token')) {
      this.userToken = localStorage.getItem('access_token')!; //el ! le indica que no sera vacio
    } else {
      this.userToken = '';
    }
  }

  getToken() {
    if (localStorage.getItem('access_token')) {
      return localStorage.getItem('access_token')!; //el ! le indica que no sera vacio
    } else {
      return null;
    }
  }

  estaAutenticado(): boolean {

    this.leerToken();
    return this.userToken.length > 2;
  }

  getformToken(order: any) {
    return this.http.post(
      this.baseUrl + '/' + environment.storeName + '/izipay/token',
      order,
      {
        responseType: 'text',
      }
    );
  }

  registrarPago(dataFromIzipay: any) {
    return this.http.post(
      this.baseUrl + '/' + environment.storeName + '/izipay/registrarpago',
      dataFromIzipay,
      {
        responseType: 'text',
      }
    );
  }

  isPartner() {
    if (localStorage.getItem('roles')) {
      //Convierte la cadena
      this.roles = JSON.parse(localStorage.getItem('roles')!); //el ! le indica que no sera vacio

      //hace un bucle similiar al foreach
      const hasSellerRole = this.roles.some(
        (role: any) => role.name === 'seller'
      );

      if (hasSellerRole) {
        // El usuario tiene el rol 'seller'
        return true;
      } else {
        // El usuario no tiene el rol 'seller'
        return false;
      }
    } else {
      return false;
    }
  }
}
