import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeadPageComponent } from "@shared/components/head-page/head-page.component";
import { ButtonBackComponent } from '@shared/components/buttons/button-back/button-back.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { Subject, takeUntil } from 'rxjs';
import { faBoxesStacked } from '@fortawesome/free-solid-svg-icons';
import { AcquireIndexComponent } from '../../acquire-index/acquire-index.component';
import { HeadSearchComponent } from 'src/app/views/shared/components/head-search/head-search.component';
import { AcquireService } from '../../acquire.service';

@Component({
  selector: 'app-acquire-index-page',
  imports: [
    HeadPageComponent,
    ButtonBackComponent,
    LoadingComponent,
    ButtonLinkComponent,
    AcquireIndexComponent,
    HeadSearchComponent
  ],
  templateUrl: './acquire-index-page.component.html',
  styleUrl: './acquire-index-page.component.scss'
})

export class AcquireIndexPageComponent implements OnInit, OnDestroy {

  acquires: any;
  faBoxesStacked = faBoxesStacked;
  loading: boolean = false;

  constructor(
    private _acquire: AcquireService
  ){
  
  }

  receiveSearchResult(acquires: any) {
    console.log(acquires);
    
    this.acquires = acquires;
  }

  ngOnInit(): void {
    this.acquiresInit();
  }

  acquiresInit(){

    this.loading = true;

    this._acquire.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.acquires = resp.data;
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
