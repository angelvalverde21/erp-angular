import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ButtonBackComponent } from '../../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RoleService } from '../../../roles/role.service';
import { CourierService } from '../courier.service';
import { CourierEditComponent } from '../courier-edit/courier-edit.component';

@Component({
  selector: 'app-courier-edit-page',
  imports: [
    LoadingComponent,
    CourierEditComponent,
    HeadPageComponent,
    ButtonBackComponent
  ],
  templateUrl: './courier-edit-page.component.html',
  styleUrl: './courier-edit-page.component.scss'
})
export class CourierEditPageComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.courierInit();
  }

  roles: any[] = [];
  loading: boolean = false;
  courier_id: number = 0;
  courier: any;

  constructor(
    private _courier: CourierService,
    private route: ActivatedRoute,
    private _role: RoleService,
  ) {
    this.route.params.subscribe(params => {
      this.courier_id = params['courier_id'];
    });
  }

  courierInit() {

    this.loading = true;

    this._courier.get(this.courier_id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.courier = resp.data;
        this.loading = false;
      },
      error: (error: any) => {
        Swal.fire('Error', 'Ocurrio un problema al traer los datos del proveedor.', 'error');
        console.error(error);
      },
    });
  }

  roles_loading: boolean = false;

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
