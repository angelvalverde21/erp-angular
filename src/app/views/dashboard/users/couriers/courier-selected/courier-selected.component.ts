import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl
} from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import Swal from 'sweetalert2';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { CourierService } from '../courier.service';
import { StoreService } from '../../../../stores/store.service';
import { BaseService } from '../../../../base.service';
@Component({
  selector: 'app-courier-selected',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    LoadingComponent,
    NgSelectModule
  ],
  templateUrl: './courier-selected.component.html',
  styleUrl: './courier-selected.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CourierSelectedComponent),
      multi: true,
    }
  ]
})

export class CourierSelectedComponent

  implements ControlValueAccessor, OnInit, OnDestroy {

  isDisabled = false;
  @Input() presentation: 'select' | 'cards' = 'select';
  courier_id: number | null = null;
  couriers: any[] = [];
  loading = false;

  private destroy$ = new Subject<void>();
  private pendingCourierId: number | null = null;

  @Output() emitCourierSelected = new EventEmitter<any>();

  onChangeCb: (value: number | null) => void = () => { };
  onTouchedCb: () => void = () => { };

  constructor(
    private _courier: CourierService,
    private _base: BaseService
  ) { }

  ngOnInit() {
    this.courierInit();
  }


  pendingCourierAddressId: number | null = null;

  writeValue(value: number | null): void {

    this.pendingCourierAddressId = value;
    this.trySetCourierAddress();

  }

  private trySetCourierAddress() {

    if (!this.couriers.length || this.pendingCourierAddressId == null) return;
    // console.log('Intentando establecer courier_address_id con valor pendiente:', this.pendingCourierAddressId);

    const courier = this.couriers.find(courier =>
      courier.addresses.some((address: any) => address.id === this.pendingCourierAddressId)
    );

    this.showSelectedAddress = true;

    this.courier_id = courier ? courier.id : null;
    this.addresses = courier ? courier.addresses : [];

    this.courier_address_id = this.pendingCourierAddressId;
    this.pendingCourierAddressId = null;

  }

  // private selectCourierFromAddress(value: number) {

  //   const courier = this.couriers.find(courier =>
  //     courier.addresses.some((address: any) => address.id === value)
  //   );

  //   if (courier) {
  //     this.setCourier(courier.id);
  //   } else {
  //     console.warn('No se encontró un courier para la dirección con ID:', value);
  //   }
  // }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  setCourier(courierId: number) {

    console.log(courierId);

    this.courier_id = courierId;

    this.showSelectedAddress = true;

    this.AddressInit(courierId);
    // this.onChangeCb(courierId);
    // this.onTouchedCb();
    this.emitCourierSelected.emit(this.couriers.find(courier => courier.id === courierId));

  }

  typeShipping: string | null = null;

  onTypeChange(type_courier: string | null): void {
    this.courier_id = null;
    this.courier_address_id = null;
    this.couriers = [];
    this.addresses = [];
    this.showSelectedAddress = false;
    this.onChangeCb(null);
    this.emitCourierSelected.emit(null);

    const request = type_courier === 'express_delivery' ? this._courier.express()
      : type_courier === 'agency_delivery' ? this._courier.agency()
      : type_courier === 'store_pickup' ? this._base.stores()
      : null;

    if (!request) {
      this.loading = false;
      return;
    }

    this.loading = true;
    request.pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false),
    ).subscribe({
      next: (resp: any) => {
        this.couriers = resp.data ?? [];
        this.setCourierDefault();
      },
      error: () => {
        Swal.fire('Error', 'Ocurrió un problema al cargar los datos. Inténtalo nuevamente.', 'error');
      },
    });
  }

  setCourierDefault() {

    this.emitCourierSelected.emit(this.couriers.length > 0 ? this.couriers[0] : null);

    this.courier_id = this.couriers.length > 0 ? this.couriers[0].id : null;
    this.addresses = this.couriers[0]?.addresses ?? [];
    console.log(this.addresses);

    this.courier_address_id = this.addresses.length > 0 ? this.addresses[0].id : null;
    console.log(this.courier_address_id);

    this.setCourierAddress(this.courier_address_id);

    this.showSelectedAddress = this.addresses.length > 0;

  }

  loadingCourierAddress: boolean = false;

  courier_address_id: number | null = null;

  setCourierAddress(courier_address_id: any) {

    this.courier_address_id = courier_address_id;
    // this.showSelectedAddress = true;
    this.onChangeCb(courier_address_id);
    this.onTouchedCb();

  }

  showSelectedAddress: boolean = false;

  private courierInit() {

    this.loading = true;

    this._courier.index()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {

        console.log(resp.data);
        this.couriers = resp.data;
        this.loading = false;

        this.couriers = resp.data.map((courier: any) => ({
          id: courier.id, // 🔥 necesario para bindValue="id"
          name: courier.name,
          is_cod: courier.is_cod,
          delivery_type: courier.delivery_type,
          freight_collect: courier.freight_collect,
          addresses: courier.addresses || [] // Asegúrate de que siempre haya un array, incluso si no hay direcciones
        }));

        console.log(this.couriers);

        this.trySetCourierAddress();

      });

  }

  ngOnDestroy() {

    this.destroy$.next();
    this.destroy$.complete();

  }

  addresses: any[] = [];

  private AddressInit(courierId: number) {

    console.log(courierId);
    const courier = this.couriers.find(courier => courier.id === courierId);
    this.addresses = courier?.addresses || [];
    this.courier_address_id = this.addresses.length > 0 ? this.addresses[0].id : null;
    this.setCourierAddress(this.courier_address_id); //seteamos el primer valor para que se muestre en el select de direcciones

  }

}
