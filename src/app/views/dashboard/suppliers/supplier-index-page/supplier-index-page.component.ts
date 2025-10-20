import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';

import { environment } from '../../../../core/environments/environment';
import { SupplierService } from '../supplier.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { FormSearchComponent } from '../../../shared/components/form/form-search/form-search.component';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SupplierIndexComponent } from '../supplier-index/supplier-index.component';
import { ButtonLinkComponent } from '../../../shared/components/buttons/button-link/button-link.component';

@Component({
  selector: 'app-supplier-index-page',
  imports: [SupplierIndexComponent, LoadingComponent, FormSearchComponent, ButtonLinkComponent],
  templateUrl: './supplier-index-page.component.html',
  styleUrl: './supplier-index-page.component.scss'
})
export class SupplierIndexPageComponent implements OnInit, OnDestroy {

  loading: boolean = true;
  suppliers: any[] = [];
  thumbnail_temp: string = environment.imageThumbnailPlaceHolderVertical;

  faPlus = faPlus;
  
  constructor(private _supplier: SupplierService){
  }

  destroy$ = new Subject<void>();

  ngOnInit(): void {
    
    this._supplier.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
      console.log(resp);
      this.suppliers = resp.data;
      this.loading = false;
      },
    
      error: (error: any) => {
        console.error(error);
        // if (error.status === 401) {
        //   this._router.navigate(['/login']);
        // }
      },
    
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
