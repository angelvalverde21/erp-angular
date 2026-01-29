import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManufactureIndexComponent } from '../manufacture-index/manufacture-index.component';
import { HeadPageComponent } from "../../../shared/components/head-page/head-page.component";
import { ButtonBackComponent } from '../../../shared/components/buttons/button-back/button-back.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';
import { UserHeadTableComponent } from '../../users/shared/user-head-table/user-head-table.component';
import { Subject, takeUntil } from 'rxjs';
import { ManufactureService } from '../manufacture.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manufacture-index-page',
  imports: [
    ManufactureIndexComponent,
    HeadPageComponent,
    ButtonBackComponent,
    LoadingComponent,
    ButtonLinkComponent,
    UserHeadTableComponent
  ],
  templateUrl: './manufacture-index-page.component.html',
  styleUrl: './manufacture-index-page.component.scss'
})

export class ManufactureIndexPageComponent implements OnInit, OnDestroy {

  manufactures: any;

  loading: boolean = false;

  constructor(
    private _manufacture: ManufactureService
  ){
  
  }

  receiveSearchResult(manufactures: any) {
    this.manufactures = manufactures;
  }

  ngOnInit(): void {
    this.manufacturesInit();
  }

  manufacturesInit(){

    this.loading = true;

    this._manufacture.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      
      next: (resp: any) => {
        console.log(resp);
        this.manufactures = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al traer los datos, intente nuevamente','error');
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
