import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { CustomerService } from '../customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { UserControlsUpdateComponent } from '../../shared/user-controls-update/user-controls-update.component';


@Component({
  selector: 'app-customer-edit',
  imports: [
    CustomerFormComponent,
    ButtonComponent,
    UserControlsUpdateComponent
  ],
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.scss'
})
export class CustomerEditComponent implements OnDestroy, OnInit {

  disabledButton: boolean = false;
  loadingIcon: boolean = false;
  form!: FormGroup;
  @Input() customer!: any;

  @Input() roles: any;
  faSave = faSave;

  constructor(
    private _customer: CustomerService,
    private fb: FormBuilder,
  ) {

  }
  ngOnInit(): void {
    this.formInit();
    this.form.patchValue(this.customer);

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
      status: ['', [Validators.required]],
      document_number: ['', [Validators.required]],
      roles: ['', [Validators.required]],
    });
  }

}


