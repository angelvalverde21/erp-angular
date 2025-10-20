import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationCancel, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../core/environments/environment';
import { User } from '../../interfaces/user.interface';
import { Store } from '../../interfaces/store.interface';
import { StoreService } from '../../core/services/store.service';
// import { LogService } from './log.service';

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

  constructor(private http: HttpClient, private router: Router, private _store: StoreService) {}


  /*************** fin de verificaciones  *******************/

  logout() {
    localStorage.setItem('access_token', '');
    localStorage.setItem('roles', '');
    localStorage.setItem('user', '');
    console.log('redireccionando a /login');

    return this.router.navigateByUrl('/login');
  }

  isLogin(user: User) {

    const path = this.baseUrl + '/' + this._store.name() + '/login'
    

    console.log(path);


    return this.http
      .post(
        path,
        user,
        this.opciones
      )
      .pipe(
        //map solo se ejecuta antes una respuesta exitosa
        map((resp: any) => {
          // this._console.log('entro al RXJS');

          console.log(resp);
          const obj = resp.data;
          this.setLogin(obj.access_token, obj.user, obj.store);
          return resp;

        })
      );
      
  }

  isRegister(data: any){

    return this.http
      .post(
        this.baseUrl + '/register',
        data,
        this.opciones
      )
      .pipe(
        //map solo se ejecuta antes una respuesta exitosa
        map((resp: any) => {
          // this._console.log('entro al RXJS');

          console.log(resp);
          const obj = resp.data;
          this.setLogin(obj.access_token, obj.user, obj.store);
          return resp;

        })
      );
  }

  private guardarToken(token: string) {
    this.userToken = token;
    localStorage.setItem('access_token', token);
  }

  setLogin(token: string, user: User, store: Store) {
    this.guardarToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('store', JSON.stringify(store));
    localStorage.setItem('slug_base', store.slug);
    this.is_auth = true;
  }

  isAuth() {
    return this.is_auth;
  }

  private getToken() {
    if (localStorage.getItem('access_token')) {
      return localStorage.getItem('access_token')!; //el ! le indica que no sera vacio
    } else {
      return null;
    }
  }

  is_token(): boolean {
    if (this.getToken() != null) {
      return true;
    } else {
      return false;
    }
  }
}
