import { Injectable } from '@angular/core';
import { API, environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class ShopifyWebService{

    baseUrl: string;

    constructor(protected http: HttpClient, private _base: BaseService) {
        this.baseUrl = `${API.public}/${this._base.store}`;
    }

    // Generic method to get all items
    tracking(order_id: number): Observable<any[]> {
        const url = `${this.baseUrl}/tracking/${order_id}`;
        console.log(url);
        return this.http.get<any[]>(`${url}`);
    }

}
