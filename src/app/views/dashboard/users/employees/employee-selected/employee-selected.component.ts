import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import Swal from 'sweetalert2';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { EmployeeService } from '../employee.service';


@Component({
  selector: 'app-employee-selected',
  standalone: true,
  imports: [
    InputGroupComponent,
    FormsModule,
    CommonModule,
    LoadingComponent
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

  employee_id: number = 0; //150101 es Lima
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

    this.searchSubject
      .pipe(debounceTime(500))  // Retrasa la búsqueda 300ms después del último evento
      .subscribe((searchTerm: string) => {
        this.searchEmployee(searchTerm);
      });

    // Esto se hace para recibir el valor de employee_id en caso se este editando una direccion
    // this.addressForm.get('employee_id')?.valueChanges.subscribe((newValue) => {
    //   this.updatedEmployeeId(newValue);

    // });

  }

  keyUpSearch($event: any) {

    console.log($event.target.value);

    const searchTerm = $event.target.value;

    if (searchTerm.length >= 3) { //permite la busqueda si hay mas de 3 caracteres

      this.loading = true;

      this.searchSubject.next(searchTerm); // Emite el término de búsqueda
    } else {
      this.onChangeCb?.(null);
    }
  }

  //***************************************************************************************************** */

  setName(employee: any) {

    console.log(employee);
    
    this.name = employee.user.name;
    this.employee_id = employee.id;
    this.onChangeCb?.(this.employee_id);
    this.showEmployees = true;

  }

  searchEmployee(name: string) {

    this._employee.search(name).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        this.showEmployees = false;
        this.loading = false;
        this.employees = resp.data;
        console.log(this.employees);

      },

      error: (error: any) => {
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

  writeValue(employee_id: number): void {

    this.employee_id = employee_id;
    console.log(this.employee_id);

    if (this.employee_id > 0) {

      this._employee.get(this.employee_id).pipe(takeUntil(this.destroy$)).subscribe({

        next: (resp: any) => {
          this.name = resp.data.user.name;
          console.log(resp.data);
        },

        error: (error: any) => {
          Swal.fire('Error', 'Ocurrió un problema al consultar el id del distrito, Inténtalo nuevamente.', 'error');
          console.error(error);
        },

      });

    }
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


}
