import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ButtonBackComponent } from '../../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RoleService } from '../../../roles/role.service';
import { CourierService } from '../courier.service';
import { CourierEditComponent } from '../courier-edit/courier-edit.component';
import { AddressCreateComponent } from '../../../addresses/address-create/address-create.component';

import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddressIndexComponent } from '../../../addresses/address-index/address-index.component';
import { faListCheck, faTruck, faHouse } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-courier-edit-page',
  imports: [
    LoadingComponent,
    CourierEditComponent,
    HeadPageComponent,
    ButtonBackComponent,
    AddressCreateComponent,
    AddressIndexComponent
  ],
  templateUrl: './courier-edit-page.component.html',
  styleUrl: './courier-edit-page.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class CourierEditPageComponent implements OnInit, OnDestroy {

  roles: any[] = [];
  loading: boolean = false;
  courier_id: number = 0;
  courier: any;
  addresses: any;

  faListCheck = faListCheck;
  faTruck = faTruck;
  faHouse = faHouse;

  constructor(
    private _courier: CourierService,
    private route: ActivatedRoute,
    private _role: RoleService,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {

    config.backdrop = 'static';
    config.keyboard = false;

    this.route.params.subscribe(params => {
      this.courier_id = params['courier_id'];
    });
  }

  ngOnInit(): void {
    this.courierInit();
  }

  courierInit() {

    this.loading = true;

    this._courier.get(this.courier_id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.courier = resp.data;
        this.addresses = resp.data.addresses;
        this.loading = false;
      },
      error: (error: any) => {
        Swal.fire('Error', 'Ocurrio un problema al traer los datos del proveedor.', 'error');
        console.error(error);
      },
    });
  }

  modal: any;
  roles_loading: boolean = false;
  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  closeModal() {
    this.modal.close();
  }

  receiveCreateAddress($event: any) {
    console.log($event);
    this.addresses.push($event);
    this.modal.close();
  }

}