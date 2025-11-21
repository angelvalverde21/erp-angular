import { computed, Injectable, signal } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { BaseService } from "./base.service";
import { catchError, map, Observable, of } from "rxjs";
import { Resp } from "../interfaces/response.interface";
import { Store } from "../interfaces/store.interface";
import { HttpClient } from "@angular/common/http";
import { API } from "../environments/environment";

@Injectable({ providedIn: 'root' })

export class StoreNameGuard implements CanActivate {

  constructor(
    private _base: BaseService,
    private router: Router,
    private http: HttpClient
  ) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

    const store =
      route.paramMap.get('store') ??
      route.parent?.paramMap.get('store');

    console.log(store);

    //========= VERIFICADOR LOCAL ===============
    if (this.verifyLocalNameStore(store)) {
      console.log("nombre verificado local");
      this._base.setStoreName(store!); // con ! aseguramos que no le pasaremos null
      return of(true);
    }

   //========= VERIFICADOR EN RED ===============

    return this.http.get<Resp>(`${API.public}/${store}`).pipe(

      map((resp: Resp) => {

        const store: Store = resp.data as Store;
        console.log(resp);
        this._base.setStoreInLocalStorage(store);
        console.log("nombre verificado con la api");
        console.log('se ha seteado el storeName ' + store.slug);
        this._base.setStoreName(store.slug!);
        return true;

      }),

      catchError((err: any) => {

        console.log(err);
        // console.log('redireccionando a la pagina de login');
        // this.router.navigate(['/', '404']);
        console.error('El nombre de la tienda ' + store + ' no existe:', err);
        return of(false); // Devuelve un observable vacío para manejar el error

      })

    );

  }

  // ============= VERIFICADOR LOCAL DEL NOMBRE DEL STORE ANTES QUE SE ENVIE AL SERVIDOR =================

  verifyLocalNameStore(storeName: string | null = ""): boolean {

    //Validaciones minimas antes de seguir

    if (storeName === "" || storeName == "" || storeName === null || storeName == null) {
      console.log("error: validacion 1");
      return false
    }

    //Esperamos mas de 3 letras
    if (storeName.length < 3) {
      console.log("error: validacion 2");
      return false;
    }

    // Ademas solo esperamos letras minusculas
    const regex = /^[a-z]+$/;

    if (!regex.test(storeName)) {
      // this.router.navigate(['/404']);
      console.log("error: validacion 3");
      return false;
    }

    //validaciones del localstorage

    const storeNameLocal = localStorage.getItem('store_name');

    if (storeNameLocal === null || storeNameLocal === "undefined" || storeNameLocal === undefined || storeNameLocal !== storeName) {
      return false;
    }

    //en caso se pasen las validaciones se retorna true

    return true;

  }


}