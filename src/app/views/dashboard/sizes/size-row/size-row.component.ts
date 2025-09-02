import { Component, EventEmitter, Input, OnDestroy, Output, ViewEncapsulation } from '@angular/core';
import { Size } from '../../../../interfaces/size.interface';
import { SizeService } from '../size.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { ButtonComponent } from '../../shared/components/buttons/button/button.component';
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-size-row',
  imports: [LoadingComponent, ButtonComponent],
  templateUrl: './size-row.component.html',
  styleUrl: './size-row.component.scss'
})
export class SizeRowComponent implements OnDestroy{

  @Input() size: any;
  @Output() emitSizeId = new EventEmitter<Number>();
  
  faTrash = faTrash

  constructor(private _size: SizeService){
  
  }

  loading: boolean = false;
    
  delete(size: Size){

    this.loading = true;

    this._size.destroy(size.product_id, size.id).pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.loading = false;
        this.emitSizeId.emit(size.id);
        Swal.fire('Elminado', 'El registro ha sido eliminado', 'success');
      },
    
      error: (error: any) => {
        this.loading = false;
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
