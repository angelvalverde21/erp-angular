import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeadPageComponent } from "@shared/components/head-page/head-page.component";
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { Subject, takeUntil } from 'rxjs';
import { faGears } from '@fortawesome/free-solid-svg-icons';
import { HeadTableComponent } from '@shared/components/head-table/head-table.component';
import { ManufactureProductionIndexComponent } from '../manufacture-production-index/manufacture-production-index.component';
import { ManufactureProductionService } from '../manufacture.production.service';
import { HeadSearchComponent } from 'src/app/views/shared/components/head-search/head-search.component';

@Component({
  selector: 'app-manufacture-production-index-page',
  imports: [
    ManufactureProductionIndexComponent,
    HeadPageComponent,
    ButtonBackComponent,
    LoadingComponent,
    ButtonLinkComponent,
    HeadSearchComponent,
  ],
  templateUrl: './manufacture-production-index-page.component.html',
  styleUrl: './manufacture-production-index-page.component.scss'
})

export class ManufactureProductionIndexPageComponent implements OnInit, OnDestroy {

  productions: any;
  faGears = faGears;
  loading: boolean = false;

  constructor(
    private _manufactureProduction: ManufactureProductionService
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

    this._manufactureProduction.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      
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
