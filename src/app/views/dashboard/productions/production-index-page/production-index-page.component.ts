import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeadPageComponent } from "@shared/components/head-page/head-page.component";
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { Subject, takeUntil } from 'rxjs';
import { ProductionService } from '../production.service';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import { HeadTableComponent } from '@shared/components/head-table/head-table.component';
import { ProductionIndexComponent } from '../production-index/production-index.component';

@Component({
  selector: 'app-production-index-page',
  imports: [
    ProductionIndexComponent,
    HeadPageComponent,
    ButtonBackComponent,
    LoadingComponent,
    ButtonLinkComponent,
    HeadTableComponent,
  ],
  templateUrl: './production-index-page.component.html',
  styleUrl: './production-index-page.component.scss'
})

export class ProductionIndexPageComponent implements OnInit, OnDestroy {

  productions: any;
  faGears = faGears;
  loading: boolean = false;

  constructor(
    private _production: ProductionService
  ){
  
  }

  receiveSearchResult(productions: any) {
    this.productions = productions;
  }

  ngOnInit(): void {
    this.productionsInit();
  }

  productionsInit(){

    this.loading = true;

    this._production.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      
      next: (resp: any) => {
        console.log(resp);
        this.productions = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        // Swal.fire('Error','Ocurrió un problema al traer los datos, intente nuevamente','error');
        console.error(error);
      },
    
    });

  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }

}
