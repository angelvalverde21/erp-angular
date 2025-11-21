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

    // Creamos el signal base con valor inicial null
    private _storeName = signal<string | null>(null);

    // Método para establecer el nombre
    setStore(name: string | null) {

        this._storeName.set(name);

    }

    // Getter para leer el valor actual directamente en TypeScript
    get store(): string | null {
        return this._storeName();
    }


    setStoreName(name: string | null) {
        this._storeName.set(name);
    }

    get storeName(): string | null {
        return this._storeName();
    }

    // Computed opcional (por ejemplo para transformarlo)
    readonly upperName = computed(() => this._storeName()?.toUpperCase() ?? '');

    // Signal de solo lectura (útil si no quieres que otros componentes lo modifiquen)
    readonly nameSignal = this._storeName.asReadonly();

    //---------------fin de uso de signals

    setStoreInLocalStorage(store: Store) {
        localStorage.setItem('store', JSON.stringify(store));
        localStorage.setItem('store_name', store.slug);
    }

}
