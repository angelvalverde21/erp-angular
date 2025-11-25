import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { EmployeeService } from '../employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { UserControlsUpdateComponent } from '../../shared/user-controls-update/user-controls-update.component';


@Component({
  selector: 'app-employee-edit',
  imports: [
    EmployeeFormComponent,
    ButtonComponent,
    UserControlsUpdateComponent
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent implements OnDestroy, OnInit {

  disabledButton: boolean = false;
  loadingIcon: boolean = false;
  form!: FormGroup;
  @Input() user!: any;

  @Input() roles: any;
  faSave = faSave;

  constructor(
    private _employee: EmployeeService,
    private fb: FormBuilder,
  ) {

  }
  ngOnInit(): void {
    this.formInit();
    // this.form.patchValue(this.employee);

    this.form.patchValue({
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      status: this.user.status,
      document_number: this.user.document_number,
      roles: this.user.roles,               // ya es array ['produccion','compras']
      salary: this.user.employee?.salary    // 👈 aquí anidas el salario
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
      status: ['', [Validators.required]],
      roles: ['', [Validators.required]],
      salary: ['', [Validators.required]],
    });
  }

}
