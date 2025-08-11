import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { SupplierIndexRowComponent } from '../supplier-index-row/supplier-index-row.component'
import { environment } from '../../../../core/environments/environment';
import { SupplierService } from '../supplier.service';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
  selector: 'app-supplier-index',
  imports: [SupplierIndexRowComponent, LoadingComponent],
  templateUrl: './supplier-index.component.html',
  styleUrl: './supplier-index.component.scss'
})
export class SupplierIndexComponent implements OnInit, OnDestroy{

  // @Input() suppliers: any[] = [];

  
  loading: boolean = true;
  suppliers: any[] = [];
  thumbnail_temp: string = environment.imageThumbnailPlaceHolderVertical;

  faPlus = faPlus;
  
  constructor(private _supplier: SupplierService){
  }

  destroy$ = new Subject<void>();
  
  reListSuppliers(id: any) {
    // this.images = this.images.filter((image) => image.id !== id);/
    // console.log('Re-listing supplier after deletion of ID:', id);
    this.suppliers = this.suppliers.filter((supplier) => supplier.id !== id);
  }

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
