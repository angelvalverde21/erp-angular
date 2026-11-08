import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressFormComponent } from '../address-form/address-form.component'
import Swal from 'sweetalert2';
import { AddressService } from '../address.service';
import { Subject, takeUntil } from 'rxjs';
import { ButtonSaveComponent } from '../../../shared/components/buttons/button-save/button-save.component';

@Component({
  selector: 'app-address-edit',
  imports: [
    ReactiveFormsModule,
    AddressFormComponent,
    ButtonSaveComponent
  ],
  templateUrl: './address-edit.component.html',
  styleUrl: './address-edit.component.scss'
})
export class AddressEditComponent implements OnInit, OnDestroy {


  @Output() emitUpdateAddress = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Input() presentation: 'default' | 'branch' = 'default';
  
  form!: FormGroup;

  @Input() address: any;
  @Input() user_id: number = 0;
  @Input() addressable_id: number = 0;
  @Input() addressable_type: string = '';

  constructor(
    private fb: FormBuilder,
    private _address: AddressService,
  ) {

  }

  ngOnInit(): void {

    this.formInit();

    this.form.patchValue(this.address);

  }

  formInit() {

    this.form = this.fb.group({

      name: ['', [Validators.required]],
      primary: ['', [Validators.required]],
      secondary: [''],
      district_id: ['', [Validators.required]],
      phone: ['', ['courier', 'store'].includes(this.addressable_type) ? [] : [Validators.required]],
      references: [''],
      document_number: [''],
      identity_id: [''],
      addressable_type: [this.addressable_type, [Validators.required]],
      addressable_id: [this.addressable_type === 'store' ? null : this.addressable_id,
        this.addressable_type === 'store' ? [] : [Validators.required]],

    });

  }

  loading: boolean = false;
  disabledButton: boolean = false;

  updateAddress() {
    if (this.loading) return;

    // console.log("empezando la creacion de una direccion");

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.disabledButton = true;
    this.loading = true;

    Swal.fire({
      title: 'Espere...',
      html: 'Actualizando el registro',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._address.update(this.address.id, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        Swal.fire('Guardado', 'La dirección ha sido actualizada', 'success');
        console.log(resp);
        this.address = resp.data;
        this.loading = false;
        this.disabledButton = false;
        this.emitUpdateAddress.emit(this.address);
        // this.form.reset();
        // this.formInit();
      },

      error: (error: any) => {
        this.disabledButton = false;
        this.loading = false;
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
