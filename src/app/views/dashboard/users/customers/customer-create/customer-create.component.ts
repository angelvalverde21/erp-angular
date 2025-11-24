import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
//

import { JsonPipe } from '@angular/common';
import { Customerservice } from '../Customer.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-customer-create',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    CustomerFormComponent,
    ButtonComponent
  ],
  templateUrl: './customer-create.component.html',
  styleUrl: './customer-create.component.scss'
})
export class CustomerCreateComponent {

  constructor(
    private fb: FormBuilder,
    private _customer: Customerservice
  ) {}

  @Output() emitCustomerCreate = new EventEmitter<any>();
  
  faSave = faSave;

  disabledButton: boolean = false;
  loadingIcon: boolean = false;

  form!: FormGroup;
  @Input() roles: any[] = [];

  private formInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      document_number: ['', [Validators.required]],
      roles: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.formInit();
    // this.form.patchValue(this.form.value);
  }

  customer: any;

  create(){

    this.loadingIcon = true;
    this.disabledButton = true;

    this._customer.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        Swal.fire('Guardado', 'El Cliente ha sido creado correctamente', 'success');
        console.log(resp);
        this.customer = resp.data;
        this.loadingIcon = false;

        this.emitCustomerCreate.emit(resp.data);

        this.disabledButton = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','OcurriÃ³ un problema al crear. IntÃ©ntalo nuevamente.','error');
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

}


