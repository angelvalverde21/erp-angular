import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import Swal from 'sweetalert2';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { EmployeeService } from '../employee.service';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-employee-selected',
  standalone: true,
  imports: [
    InputGroupComponent,
    FormsModule,
    CommonModule,
    LoadingComponent,
    NgSelectModule
  ],
  templateUrl: './employee-selected.component.html',
  styleUrl: './employee-selected.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmployeeSelectedComponent),
      multi: true,
    }
  ]
})

export class EmployeeSelectedComponent implements ControlValueAccessor, OnInit, OnDestroy {

  faSearch = faSearch;

  @Input() isValid: boolean = false;
  @Input() isInvalid: boolean = false;

  isDisabled: boolean = false;

  private pendingEmployeeId: number | null = null;

  employee_id: number | null = null;
  name: string = "";
  employees: any[] = [];
  showEmployees: boolean = true;
  loading: boolean = false;

  searchSubject: Subject<string> = new Subject();

  constructor(
    private _employee: EmployeeService
  ) {

  }

  ngOnInit(): void {
    this.employeesInit();
  }

  //***************************************************************************************************** */

  setEmployee(employee: any) {

    this.employee_id = employee.id;
    this.onChangeCb?.(employee.id);

  }

  employeesInit() {

    // this.loading = true;

    this._employee.index().pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        this.showEmployees = false;
        this.loading = false;
        this.employees = resp.data;
        console.log(this.employees);
        this.trySetEmployee();
      },
      
      error: (error: any) => {
        this.loading = false;
        Swal.fire('Error', 'Ocurrió un problema al traer los empleados, intente nuevamente', 'error');
        console.error(error);
      },

    });

  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  // setDistrictId(event:any){

  //   console.log(event.target.value);
  //   this.onChangeCb?.(event.target.value);

  // }

  onChangeCb?: (employee_id: number | null) => void; //esta funcion es un callback para registerOnChange
  onTouchedCb?: () => void;

  writeValue(employee_id: number | null): void {
    this.pendingEmployeeId = employee_id;
    this.trySetEmployee();
  }

  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }


  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  private trySetEmployee() {

    if (!this.employees.length) return;
    if (this.pendingEmployeeId == null) return;

    const exists = this.employees.some(
      e => e.id === this.pendingEmployeeId
    );

    if (exists) {
      this.employee_id = this.pendingEmployeeId;
      this.pendingEmployeeId = null;
    }
  }

}
