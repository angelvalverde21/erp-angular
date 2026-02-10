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
import { IdentityService } from '../identity.service';
@Component({
  selector: 'app-identity-selected',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    LoadingComponent,
    NgSelectModule
  ],
  templateUrl: './identity-selected.component.html',
  styleUrl: './identity-selected.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentitySelectedComponent),
      multi: true,
    }
  ]
})

export class IdentitySelectedComponent

  implements ControlValueAccessor, OnInit, OnDestroy {

  isDisabled = false;
  identity_id: number | null = null;
  identities: any[] = [];
  loading = false;

  private destroy$ = new Subject<void>();
  private pendingIdentityId: number | null = null;

  onChangeCb: (value: number | null) => void = () => {};
  onTouchedCb: () => void = () => {};

  constructor(private _identity: IdentityService) {}

  ngOnInit() {
    this.identityInit();
  }

  writeValue(value: number | null): void {
    this.pendingIdentityId = value;
    this.trySetIdentity();
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

  setIdentity(identityId: number | null) {
    this.identity_id = identityId;
    this.onChangeCb(identityId);
    this.onTouchedCb();
  }

  private identityInit() {
    this._identity.index()
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {
        this.identities = resp.data;
        this.trySetIdentity();
      });
  }

  private trySetIdentity() {
    if (!this.identities.length || this.pendingIdentityId == null) return;
    this.identity_id = this.pendingIdentityId;
    this.pendingIdentityId = null;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}