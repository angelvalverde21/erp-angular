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
  
  form!: FormGroup;

  @Input() address: any;
  @Input() user_id: number = 0;

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
      phone: ['', [Validators.required]],
      references: [''],
      document_number: [''],
      user_id: [this.user_id, [Validators.required]],

    });

  }

  loading: boolean = false;
  disabledButton: boolean = false;

  updateAddress() {

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

        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
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
