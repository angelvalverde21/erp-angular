import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  
  constructor() {}

  /****************************************************************************** */

  private iconLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  ); //aqui el BehaviorSubject necesita un valor inicial en el argumento y le estamos pasando []

  //Envia el valor de la propieadad a los componentes
  getIconLoadingObservable() {
    return this.iconLoading.asObservable();
  }

  //Establece el valor de la propiedad
  setIconLoading(value: boolean) {
    // console.log();
    this.iconLoading.next(value);
  }

  /****************************************************************************** */


  /****************************************************************************** */

  private cardPlaceHolderLoading: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false); //aqui el BehaviorSubject necesita un valor inicial en el argumento y le estamos pasando []

  //Envia el valor de la propieadad a los componentes
  getCardPlaceHolderObservable() {
    return this.cardPlaceHolderLoading.asObservable();
  }

  //Establece el valor de la propiedad
  setCardPlaceHolder(value: boolean) {
    // console.log();
    this.cardPlaceHolderLoading.next(value);
  }

  /****************************************************************************** */

  private showSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  ); //aqui el BehaviorSubject necesita un valor inicial en el argumento y le estamos pasando []

  //Envia el valor de la propieadad a los componentes
  getShowSearchObservable() {
    return this.showSearch.asObservable();
  }

  //Establece el valor de la propiedad
  setShowSearch(value: boolean) {
    // console.log();
    this.showSearch.next(value);
  }

  /****************************************************************************** */
}
