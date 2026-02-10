import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { SupplierService } from '../supplier.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { SupplierFormComponent } from '../supplier-form/supplier-form.component';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { phoneValidator } from '@shared/validators/phone.validator';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';

@Component({
  selector: 'app-supplier-create',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    SupplierFormComponent,
    ButtonSaveComponent
  ],
  templateUrl: './supplier-create.component.html',
  styleUrl: './supplier-create.component.scss'
})
export class SupplierCreateComponent {

  constructor(
    private fb: FormBuilder,
    private _supplier: SupplierService
  ) {}

  @Output() emitSupplierCreate = new EventEmitter<any>();
  @Input() button_text: string = 'Guardar';
  
  faSave = faSave;

  disabledButton: boolean = false;
  loadingIcon: boolean = false;

  form!: FormGroup;
  @Input() roles: any[] = [];

  ngOnInit(): void {
    this.formInit();
  }

  supplier: any;

  create(){

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    Swal.fire({
      title: 'Espere...',
      html: 'Registrando proveedor',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    })
    

    this.loadingIcon = true;
    this.disabledButton = true;

    this._supplier.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        Swal.fire('Guardado', 'El proveedor ha sido creado correctamente', 'success');
        console.log(resp);
        this.supplier = resp.data;
        this.loadingIcon = false;
        this.emitSupplierCreate.emit(resp.data);
        this.disabledButton = false;
      },
      error: (error: any) => {
        Swal.fire('Error','Ocurrio un problema al crear. Intentalo nuevamente.','error');
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
      identity_id: [null],
      document_number: [''],
    });
  }
  
}
