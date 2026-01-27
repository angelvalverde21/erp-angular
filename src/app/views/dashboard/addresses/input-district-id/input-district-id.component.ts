import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { DistrictService } from './district.service';
import Swal from 'sweetalert2';
import { faPenSquare } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-input-district-id',
  standalone: true,
  imports: [
    InputGroupComponent,
    FormsModule,
    CommonModule,
    LoadingComponent
  ],
  templateUrl: './input-district-id.component.html',
  styleUrl: './input-district-id.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDistrictIdComponent),
      multi: true,
    }
  ]
})

export class InputDistrictIdComponent implements ControlValueAccessor, OnInit, OnDestroy {

  faPenSquare = faPenSquare;
  
  @Input() isValid: boolean = false;
  @Input() isInvalid: boolean = false;

  isDisabled: boolean = false;

  district_id: number = 150101; //150101 es Lima
  name: string = "";
  nameSubscription!: Subscription;
  districts: any[] = [];
  showDistricts: boolean = true;
  loading: boolean = false;

  searchSubject: Subject<string> = new Subject();

  constructor(
    private _district: DistrictService
  ) {

  }

  ngOnInit(): void {

    this.searchSubject
      .pipe(debounceTime(500))  // Retrasa la búsqueda 300ms después del último evento
      .subscribe((searchTerm: string) => {
        this.searchDistrict(searchTerm);
      });

    // Esto se hace para recibir el valor de district_id en caso se este editando una direccion
    // this.addressForm.get('district_id')?.valueChanges.subscribe((newValue) => {
    //   this.updatedDistrictId(newValue);

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

  setName(district: any) {

    this.name = `${district.name} - ${district.province.name} - ${district.province.department.name}`;
    this.district_id = district.id;
    this.onChangeCb?.(this.district_id);
    this.showDistricts = true;

  }

  searchDistrict(name: string) {

    this._district.search(name).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {

        this.showDistricts = false;
        this.loading = false;
        this.districts = resp.data;
        console.log(this.districts);

      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrió un problema al traer los distritos, intente nuevamente', 'error');
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

  onChangeCb?: (district_id: number | null) => void; //esta funcion es un callback para registerOnChange
  onTouchedCb?: () => void;

  writeValue(district_id: number): void {

    this.district_id = district_id;
    console.log(this.district_id);

    if (this.district_id > 0) {


      this._district.get(this.district_id).pipe(takeUntil(this.destroy$)).subscribe({

        next: (resp: any) => {
          const district = resp.data;
          this.name = `${district.name} - ${district.province.name} - ${district.province.department.name}`;
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
