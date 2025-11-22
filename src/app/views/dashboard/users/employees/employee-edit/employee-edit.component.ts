import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { EmployeeService } from '../employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { faSave } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-employee-edit',
  imports: [
    EmployeeFormComponent,
    ButtonComponent
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.scss'
})
export class EmployeeEditComponent implements OnDestroy, OnInit{

  disabledButton: boolean = false;
  loadingIcon: boolean = false;
  form!: FormGroup;
  @Input() employee!: any;

  @Input() roles: any; 
  faSave = faSave;

  constructor(
    private _employee: EmployeeService,
    private fb: FormBuilder,
  ) {

  }
  ngOnInit(): void {
    this.formInit();
    this.form.patchValue(this.employee);
    
  }

  update() {

    this.disabledButton = true;
    this.loadingIcon = true;

    this._employee.update(this.employee.id!, this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        Swal.fire('Guardado', 'El registro ha sido actualizado', 'success');
        this.disabledButton = false;
        this.loadingIcon = false;
        // this.success = true;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al actualizar. Inténtalo nuevamente.', 'error');
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
      salary: ['', [Validators.required]],
    });
  }

}
