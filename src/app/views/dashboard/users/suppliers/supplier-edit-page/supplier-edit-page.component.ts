import { Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { SupplierEditComponent } from '../supplier-edit/supplier-edit.component';
import { ButtonBackComponent } from '../../../../shared/components/buttons/button-back/button-back.component';
import { HeadPageComponent } from "../../../../shared/components/head-page/head-page.component";
import { Subject, takeUntil } from 'rxjs';
import { SupplierService } from '../supplier.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RoleService } from '../../../roles/role.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddressIndexComponent } from '../../../addresses/address-index/address-index.component';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { AddressCreateComponent } from '../../../addresses/address-create/address-create.component';

@Component({
  selector: 'app-supplier-edit-page',
  imports: [
    LoadingComponent,
    SupplierEditComponent,
    HeadPageComponent,
    ButtonBackComponent,
    AddressIndexComponent,
    AddressCreateComponent
  ],
  templateUrl: './supplier-edit-page.component.html',
  styleUrl: './supplier-edit-page.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SupplierEditPageComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
    this.supplierInit();
    this.rolesInit();
  }

  faHouse = faHouse;

  roles: any[] = [];
  loading: boolean = false;
  supplier_id: number = 0;
  supplier: any;

  constructor(
    private _supplier: SupplierService,
    private route: ActivatedRoute,
    private _role: RoleService,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {

    config.backdrop = 'static';
    config.keyboard = false;

    this.route.params.subscribe(params => {
      this.supplier_id = params['supplier_id'];
    });
  }

  modal: any;

  supplierInit() {

    this.loading = true;

    this._supplier.get(this.supplier_id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.supplier = resp.data;
        this.loading = false;
      },
      error: (error: any) => {
        Swal.fire('Error', 'OcurriA3 un problema al traer los datos del proveedor.', 'error');
        console.error(error);
      },
    });
  }

  roles_loading: boolean = false;

  rolesInit() {

    this.roles_loading = true;
    this._role.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.roles = resp.data;
        this.roles_loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'OcurriA3 un problema al listar los roles del sistema', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeModal() {
    this.modal.close();
  }


  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  receiveCreateAddress($event: any) {
    console.log($event);
    this.supplier.addresses.unshift($event);
    this.modal.close();
  }

}


