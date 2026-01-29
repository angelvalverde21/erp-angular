import { Component, OnDestroy, OnInit } from '@angular/core';
import { ManufactureEditComponent } from '../manufacture-edit/manufacture-edit.component';
import { LoadingComponent } from 'src/app/views/shared/components/loading/loading.component';
import { HeadPageComponent } from 'src/app/views/shared/components/head-page/head-page.component';
import { ButtonLinkComponent } from 'src/app/views/shared/components/buttons/button-link/button-link.component';
import { ManufactureService } from '../manufacture.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manufacture-edit-page',
  imports: [
    ManufactureEditComponent,
    LoadingComponent,
    HeadPageComponent,
    ButtonLinkComponent
  ],
  templateUrl: './manufacture-edit-page.component.html',
  styleUrl: './manufacture-edit-page.component.scss'
})
export class ManufactureEditPageComponent implements OnInit, OnDestroy{


  loading: boolean = false;
  manufacture: any = null;
  manufacture_id: number = 0;

  constructor(
    private _manufacture: ManufactureService,
    private route: ActivatedRoute,
  ) {

    this.route.params.subscribe(params => {
      this.manufacture_id = params['manufacture_id'];
    });
  }
  ngOnInit(): void {
    this.manufactureInit();
  }

  manufactureInit(){
    
    this.loading = true;

    this._manufacture.get(this.manufacture_id).pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        console.log(resp);
        this.manufacture = resp.data;
        this.loading = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema guardar. Inténtalo nuevamente.','error');
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
