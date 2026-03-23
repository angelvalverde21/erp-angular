import { Component, OnDestroy, OnInit } from '@angular/core';
import { CourierCreateComponent } from '../courier-create/courier-create.component';
import { ButtonBackComponent } from '../../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { Subject, takeUntil } from 'rxjs';
import { RoleService } from '../../../roles/role.service';
import Swal from 'sweetalert2';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-courier-create-page',
  imports: [
    CourierCreateComponent,
    ButtonBackComponent,
    HeadPageComponent,
    LoadingComponent
  ],
  templateUrl: './courier-create-page.component.html',
  styleUrl: './courier-create-page.component.scss'
})
export class CourierCreatePageComponent implements OnInit, OnDestroy{

  roles: any[] = [];
  loading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
      private _role: RoleService,
      private router: Router,
      private route: ActivatedRoute
  ){}
  
  ngOnInit(): void {
    // this.rolesInit();
  }

  // rolesInit() {

  //   this.loading = true;
  //   this._role.index().pipe(takeUntil(this.destroy$)).subscribe({

  //     next: (resp: any) => {
  //       console.log(resp);
  //       this.roles = resp.data;
  //       this.loading = false;
  //     },

  //     error: (error: any) => {
  //       Swal.fire('Error', 'OcurriA3 un problema al listar los roles del sistema', 'error');
  //       console.error(error);
  //     },

  //   });
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  receiveCourierCreate(courier: any) {
      console.log(courier);
      if (courier) {
        this.router.navigate(['../', courier.id], { relativeTo: this.route })
          .then(() => {
            console.log('Nueva URL:', this.router.url);
          });
      }
    }
}
