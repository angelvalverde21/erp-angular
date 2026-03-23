import {
  Component,
  forwardRef,
  OnDestroy,
  OnInit,
  Optional,
  Self
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import Swal from 'sweetalert2';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgSelectModule } from '@ng-select/ng-select';
import { GatewayService } from '../gateway.service';
@Component({
  selector: 'app-gateway-selected',
  standalone: true,
  imports: [
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

export class GatewaySelectedComponent

  implements ControlValueAccessor, OnInit, OnDestroy {

  isDisabled = false;
  gateway_id: number | null = null;
  gateways: any[] = [];
  loading = false;

  private destroy$ = new Subject<void>();
  private pendingGatewayId: number | null = null;

  onChangeCb: (value: number | null) => void = () => {};
  onTouchedCb: () => void = () => {};

  constructor(private _gateway: GatewayService) {}

  ngOnInit() {
    this.gatewayInit();
  }

  writeValue(value: number | null): void {
    this.pendingGatewayId = value;
    this.trySetGateway();
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  setGateway(gatewayId: number | null) {
    this.gateway_id = gatewayId;
    this.onChangeCb(gatewayId);
    this.onTouchedCb();
  }

  private gatewayInit() {
    this._gateway.index()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {
        this.gateways = resp.data;
        this.trySetGateway();
      });
  }

  private trySetGateway() {
    if (!this.gateways.length || this.pendingGatewayId == null) return;
    this.gateway_id = this.pendingGatewayId;
    this.pendingGatewayId = null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}