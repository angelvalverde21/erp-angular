import { computed, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Resp } from '../interfaces/response.interface';
import { Store } from '../interfaces/store.interface';


@Injectable({
    providedIn: 'root',
})
export class BaseService {

    baseUrl: string = "";

    constructor(private http: HttpClient, private router: Router) {
        
    }
    //-----------------uso de signals

    // ✅ Creamos el signal base con valor inicial null
    private _storeName = signal<string | null>(null);

    // ✅ Método para establecer el nombre
    setStore(name: string) {

        this._storeName.set(name);

    }

    // ✅ Getter para leer el valor actual directamente en TypeScript
    get store(): string | null {
        return this._storeName();
    }

    // ✅ Computed opcional (por ejemplo para transformarlo)
    readonly upperName = computed(() => this._storeName()?.toUpperCase() ?? '');

    // ✅ Signal de solo lectura (útil si no quieres que otros componentes lo modifiquen)
    readonly nameSignal = this._storeName.asReadonly();

    //---------------fin de uso de signals

    /*** setter and getter  ***/

    // private storeName$ = new BehaviorSubject<string | null>(null);

    // setStore(name: string) {
    //   this.storeName$.next(name);
    // }

    // getStore() {
    //   return this.storeName$.asObservable();
    // }

    // getStoreValue() {
    //   return this.storeName$.value;
    // }

    /*** fin de setter and getter  ***/

    // name() {
    //   if (environment.storeName) {
    //     return environment.storeName;
    //   } else {
    //     return localStorage.getItem('slug_base')!;
    //   }
    // }

    slugIsValid$(name: string): Observable<boolean> {
        //name quiere decir el nombre del la primera (storeName) palabra del slug /storeName/login/etc

        console.log('Impresión desde la función setSlugBase: ' + name);

        if (!name) {
            //si no hay nada en name paro la ejecucion y devuelvo false
            return of(false);
        }

        const slug_base = localStorage.getItem('slug_base');


        if (slug_base === null || slug_base !== name || slug_base === "undefined") {

            console.log('Empezamos a verificar el slug inicial ' + name);
            return this.verifySlugApi$(name);

        } else {

            console.log('El slug existe y es ' + name);

            return of(true);
        }
    }

    verifySlugApi$(name: string): Observable<boolean> {

        return this.http.get<Resp>(`${this.baseUrl}/${name}`).pipe(

            map((resp: Resp) => {

                const store: Store = resp.data as Store;

                console.log(resp);
                this.setLocalStorage(store);

                console.log('se ha seteado el slug_base ' + name);

                return true;

            }),

            catchError((err: any) => {
                console.log(err);

                // console.log('redireccionando a la pagina de login');
                this.router.navigate(['/', '404']);
                console.error('El nombre de la tienda ' + name + ' no existe:', err);
                return of(false); // Devuelve un observable vacío para manejar el error
            })
        );
    }

    setLocalStorage(store: Store) {
        localStorage.setItem('store', JSON.stringify(store));
        localStorage.setItem('slug_base', store.slug);
    }

}
