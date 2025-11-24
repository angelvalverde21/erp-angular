import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { Customerservice } from '../Customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { faSave } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-customer-edit',
  imports: [
    CustomerFormComponent,
    ButtonComponent
  ],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss'
})
export class CustomerEditComponent implements OnDestroy, OnInit{

  disabledButton: boolean = false;
  loadingIcon: boolean = false;
  form!: FormGroup;
  @Input() customer!: any;

  @Input() roles: any; 
  faSave = faSave;

  constructor(
    private _customer: Customerservice,
    private fb: FormBuilder,
  ) {

  }
  ngOnInit(): void {
    this.formInit();
    this.form.patchValue(this.customer);
    
  }

  update() {

    this.disabledButton = true;
    this.loadingIcon = true;

    this._customer.update(this.customer.id!, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        this.disabledButton = false;
        this.loadingIcon = false;
        // this.success = true;
      },

      error: (error: any) => {
        Swal.fire('Error', 'OcurriÃ³ un problema al actualizar. IntÃ©ntalo nuevamente.', 'error');
        console.error(error);
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
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      document_number: ['', [Validators.required]],
      roles: ['', [Validators.required]],
    });
  }

}


