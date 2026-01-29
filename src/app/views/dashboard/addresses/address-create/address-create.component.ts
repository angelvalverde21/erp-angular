import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AddressFormComponent } from '../address-form/address-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { AddressService } from '../address.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ButtonSaveComponent } from '../../../shared/components/buttons/button-save/button-save.component';

@Component({
  selector: 'app-address-create',
  imports: [
    AddressFormComponent,
    ReactiveFormsModule,
    JsonPipe,
    ButtonSaveComponent
  ],
  templateUrl: './address-create.component.html',
  styleUrl: './address-create.component.scss'
})
export class AddressCreateComponent implements OnInit, OnDestroy {

  form!: FormGroup

  @Output() emitCreateAddress = new EventEmitter<any>();
  @Input() user_id: number = 0;

  constructor(
    private fb: FormBuilder,
    private _address: AddressService
  ) {

  }
  ngOnInit(): void {
    this.formInit();

    // this.form.statusChanges.subscribe((status) => {
    //   console.log(status);
    // });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  formInit() {

    this.form = this.fb.group({

      name: ['', [Validators.required]],
      primary: ['', [Validators.required]],
      secondary: [''],
      district_id: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      references: ['', [Validators.required]],
      document_number: ['', [Validators.required]],
      user_id: [this.user_id, [Validators.required]],

    });


  }

  loading: boolean = false;
  disabledButton: boolean = false;
  address: any;

  createAddress() {

    console.log("empezando la creacion de una direccion");

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.disabledButton = true;
    this.loading = true;

    Swal.fire({
      title: 'Espere...',
      html: 'Guardando el registro',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })

    this._address.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido creado', 'success');
        console.log(resp);
        this.address = resp.data;
        this.loading = false;
        this.disabledButton = false;
        this.emitCreateAddress.emit(this.address);
        this.form.reset();
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


}
