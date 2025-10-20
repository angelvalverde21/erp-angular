import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from '../../../../core/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class SlugBaseService {

  constructor(
    private router: Router,
  ) { }

  // navigate(arraySlug : any[] = []){

  //   if(environment.showStoreNameInSlug){
  //     return this.router.navigate(['/', environment.storeName, ...arraySlug]);
  //   }else{
  //     return this.router.navigate(['/', ...arraySlug]);
  //   }
  // }


  navigate(arraySlug: any[] = [], extras: NavigationExtras = {}) {
    const base = environment.showStoreNameInSlug ? ['/', environment.storeName, ...arraySlug] : ['/', ...arraySlug];

    return this.router.navigate(base, extras);
  }

}
