import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { API, environment } from '../../environments/environment';
import { StoreService } from '../stores/store.service';
import { BaseService } from '../base.service';

// import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // baseUrl: string  = environment.apiPublic;
  baseUrl: string  = "";

  constructor(
    private http: HttpClient, 
    private router: Router,
    private _base: BaseService
  ) {
    this.baseUrl = `${API.private}/${this._base.store}`;
  }
  
  isValid(name: string): Observable<boolean> {
    //name quiere decir el nombre del la primera (storeName) palabra del slug /storeName/login/etc

    console.log('Impresión desde la función setSlugBase: ' + name);

    if (!name) {
      return of(false);
    }

    if (
      localStorage.getItem('slug_base') === null ||
      localStorage.getItem('slug_base') !== name
    ) {
      console.log('verificaremos el slug inicial ' + name);

      return this.SlugVerification(name);

    } else {
      console.log('El slug existe y es ' + name);

      return of(true);
    }
    
  }

  SlugVerification(name: string): Observable<boolean> {

    return this.verifyStore(name).pipe(

      map((resp: any) => {

        console.log('se ha seteado el slug_base ' + name);
        console.log(resp);

        localStorage.setItem('store', JSON.stringify(resp.data));
        localStorage.setItem('slug_base', name);

        return true;

      }),

      catchError((err: any) => {

        // console.log('redireccionando a la pagina de login');
        this.router.navigate(['/','404']);
        console.error('El nombre de la tienda ' + name + ' no existe:', err);
        return of(false); // Devuelve un observable vacío para manejar el error
      })

    );
  }

  verifyStore(store: string): Observable<any> {

    // Construye la URL con el parámetro 'nombre'

    // const url = `${this.url_base}/${store}/verify`; // ya nos e usa verify porque el erp verifica el nombre del store desde el inicio
    // const url = `${this.baseUrl}/${store}`;

    // const url = `${this.url_base}?store=${store}`;
    const urlPublic = `${environment.apiPublic}/${environment.storeName}`;
    console.log(urlPublic);

    return this.http.get(urlPublic);
    
  }


  getGallery(path: string = ""): Observable<any> {
    const url = `${this.baseUrl}/dashboard/${path}`;
    console.log(url);
    
    return this.http.get(url);
  }

  getDasboard(path: string = ""): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

}
