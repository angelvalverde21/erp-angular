import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
//

import { JsonPipe } from '@angular/common';
import { EmployeeService } from '../employee.service';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { ButtonComponent } from '../../../../shared/components/buttons/button/button.component';
import { faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-employee-create',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    EmployeeFormComponent,
    ButtonComponent
  ],
  templateUrl: './employee-create.component.html',
  styleUrl: './employee-create.component.scss'
})
export class EmployeeCreateComponent {

  constructor(
    private fb: FormBuilder,
    private _employee: EmployeeService
  ) {}

  @Output() emitEmployeeCreate = new EventEmitter<any>();
  
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
      salary: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.formInit();
    // this.form.patchValue(this.form.value);
  }

  employee: any;

  create(){

    this.loadingIcon = true;
    this.disabledButton = true;

    this._employee.store(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({
    
      next: (resp: any) => {
        Swal.fire('Guardado', 'El empleado ha sido creado correctamente', 'success');
        console.log(resp);
        this.employee = resp.data;
        this.loadingIcon = false;

        this.emitEmployeeCreate.emit(resp.data);

        this.disabledButton = false;
      },
    
      error: (error: any) => {
        Swal.fire('Error','Ocurrió un problema al crear. Inténtalo nuevamente.','error');
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
