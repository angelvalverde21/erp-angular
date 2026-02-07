import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GatewayFormComponent } from '../gateway-form/gateway-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { GatewayService } from '../gateway.service';

@Component({
  selector: 'app-gateway-edit',
  imports: [
    GatewayFormComponent,
    ButtonSaveComponent
  ],
  templateUrl: './gateway-edit.component.html',
  styleUrl: './gateway-edit.component.scss'
})
export class GatewayEditComponent {

  form!: FormGroup;

  @Input() gateway: any;

  @Output() emitGatewayUpdate = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private _gateway: GatewayService
  ) {

  }

  ngOnInit(): void {

    this.form = this.fb.group({
      title: ['', Validators.required]
    });

    this.form.patchValue(this.gateway);
  }

  loading: boolean = false;

  update() {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this._gateway.update(this.gateway.id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.gateway = resp.data;
        this.loading = false;
        this.emitGatewayUpdate.emit(this.gateway);
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
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
