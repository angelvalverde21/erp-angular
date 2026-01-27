import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { CourierService } from '../courier.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { phoneValidator } from '../../../../shared/validators/phone.validator';
import { CourierFormComponent } from '../courier-form/courier-form.component';
import { AddressCreateComponent } from '../../../addresses/address-create/address-create.component'

@Component({
  selector: 'app-courier-create',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    CourierFormComponent,
    ButtonComponent,
    AddressCreateComponent
  ],
  templateUrl: './courier-create.component.html',
  styleUrl: './courier-create.component.scss'
})
export class CourierCreateComponent {

  constructor(
    private fb: FormBuilder,
    private _courier: CourierService
  ) { }

  @Output() emitCourierCreate = new EventEmitter<any>();
  @Input() button_text: string = 'Guardar';

  faSave = faSave;

  disabledButton: boolean = false;
  loadingIcon: boolean = false;

  form!: FormGroup;
  @Input() roles: any[] = [];

  ngOnInit(): void {
    this.formInit();
  }

  courier: any;

  create() {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    Swal.fire({
      title: 'Espere...',
      html: 'Registrando courier',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })


    this.loadingIcon = true;
    this.disabledButton = true;

    this._courier.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        Swal.fire('Guardado', 'El courier ha sido creado correctamente', 'success');
        console.log(resp);
        this.courier = resp.data;
        this.loadingIcon = false;
        this.emitCourierCreate.emit(resp.data);
        this.disabledButton = false;
      },
      error: (error: any) => {
        Swal.fire('Error', 'Ocurrio un problema al crear. Intentalo nuevamente.', 'error');
        console.error(error);
        this.loadingIcon = false;
        this.disabledButton = false;
      },
    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      phone: ['', phoneValidator],
      email: [''],
      document_number: [''],
      is_cash_on_delivery: [null, [Validators.required]],
      is_freight_collect: [null, [Validators.required]],
      is_express_shipping: [null, [Validators.required]],
    });
  }

}
