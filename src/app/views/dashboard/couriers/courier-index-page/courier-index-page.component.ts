import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { CourierService } from '../courier.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-courier-index-page',
  imports: [
    LoadingComponent
  ],
  templateUrl: './courier-index-page.component.html',
  styleUrl: './courier-index-page.component.scss'
})
export class CourierIndexPageComponent implements OnInit, OnDestroy{

  loading: boolean = false;
  couriers: any;

  constructor(
    private _courier: CourierService
  ){
  
  }

  couriersInit(){

    this.loading = true;

    this._courier.index().pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.couriers = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al cargar los datos. Inténtalo nuevamente.','error');
        console.error(error);
      },
    
    });

  }

  destroy$ = new Subject<void>();
  
  ngOnDestroy(): void {
  
    this.destroy$.next();
    this.destroy$.complete();
  
  }
  
  ngOnInit(): void {

  }



}
