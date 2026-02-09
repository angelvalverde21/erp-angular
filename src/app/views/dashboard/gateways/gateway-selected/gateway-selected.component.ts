import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import Swal from 'sweetalert2';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { GatewayService } from '../gateway.service';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-gateway-selected',
  standalone: true,
  imports: [
    InputGroupComponent,
    FormsModule,
    CommonModule,
    LoadingComponent,
    NgSelectModule
  ],
  templateUrl: './gateway-selected.component.html',
  styleUrl: './gateway-selected.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GatewaySelectedComponent),
      multi: true,
    }
  ]
})

export class GatewaySelectedComponent implements ControlValueAccessor, OnInit, OnDestroy {

  faSearch = faSearch;

  @Input() isValid: boolean = false;
  @Input() isInvalid: boolean = false;

  isDisabled: boolean = false;
  private pendingGatewayId: number | null = null;

  gateway_id: number = 0; //150101 es Lima
  name: string = "";
  gateways: any[] = [];
  showgateways: boolean = true;
  loading: boolean = false;

  searchSubject: Subject<string> = new Subject();

  constructor(
    private _gateway: GatewayService
  ) {

  }

  ngOnInit(): void {

    this.gatewayInit();

  }

  //***************************************************************************************************** */

  gatewayInit() {

    this.loading = true;

    this._gateway.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        this.loading = false;
        this.gateways = resp.data;
        console.log(this.gateways);
        this.trySetGateway();

      },
      error: (error: any) => {

        this.loading = false;
        Swal.fire('Error', 'Ocurrió un problema al traer los gateways, intente nuevamente', 'error');
        console.error(error);

      },

    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  // setDistrictId(event:any){

  //   console.log(event.target.value);
  //   this.onChangeCb?.(event.target.value);

  // }

  onChangeCb?: (gateway_id: number | null) => void; //esta funcion es un callback para registerOnChange
  onTouchedCb?: () => void;

  writeValue(gateway_id: number | null): void {

    console.log(gateway_id);
    

    this.pendingGatewayId = gateway_id;
    this.trySetGateway();
  }

  setGateway(gateway: any) {

    console.log(gateway.id);
    this.onChangeCb?.(gateway.id);

  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }


  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  private trySetGateway() {

    if (!this.gateways.length) return;
    if (this.pendingGatewayId == null) return;

    const exists = this.gateways.some(
      e => e.id === this.pendingGatewayId
    );

    if (exists) {
      this.gateway_id = this.pendingGatewayId;
      this.pendingGatewayId = null;
    }
  }

}
