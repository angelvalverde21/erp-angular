import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormSelectDirective } from '@coreui/angular';
import { Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { IdentityService } from '../identity.service';
@Component({
  selector: 'app-identity-selected',
  imports: [FormSelectDirective, LoadingComponent, FormsModule],
  templateUrl: './identity-selected.component.html',
  styleUrl: './identity-selected.component.scss',
    providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentitySelectedComponent),
      multi: true,
    },
  ],
})
export class IdentitySelectedComponent implements OnInit, ControlValueAccessor {

    private destroy$ = new Subject<void>();

  constructor(private _identity: IdentityService) {}

  @Input() identities: any[] = [];
  loading: boolean = true;
  identity_id: number | null = null;
  @Output() emitIdentitySelected = new EventEmitter<[]>();

  
  ngOnInit(): void {
    // Initialization logic here
    //cargar categorias
  
    this.initidentities();
  }

  initidentities() {

    this.loading = true;
    this._identity.index().pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        this.identities = resp.data;
        console.log(this.identities);

        this.loading = false;
      },
      error: (error: any) => {
        console.error(error);
        this.loading = false;
      },
    });
  }

  value: any = '';

  private onChangeFn: (value: any) => void = () => {};
  private onTouchedFn: () => void = () => {};

  // Se llama cuando el valor externo cambia (ej. setValue)
  writeValue(value: any): void {
    this.value = value;
  }

  // Se registra una función para llamar cuando cambia el valor desde el componente
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  // Se registra una función para llamar cuando el control es tocado
  registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  // Si el control puede ser deshabilitado
  setDisabledState?(isDisabled: boolean): void {
    // Implementar si el input debe reaccionar a disable/enable
  }

  // Métodos internos que llaman a las funciones registradas
  onChange(value: any) {
    this.value = value;
    this.onChangeFn(value);
  }

  onTouched() {
    this.onTouchedFn();
  }

  findidentityById(items: any[], id: number): any | undefined {
    for (const item of items) {
      // console.log(item);
      if (item.id == id) {
        return item;
      }
  
    }
  
    return undefined;
  }

  onIdentityChange(event: any) {
    console.log(event.target.value); // Imprime el valor seleccionado en la consola
    // console.log(event.target); // Imprime el valor seleccionado en la consola
    // console.log(this.findidentityById(this.identities, event.target.value));

    this.emitIdentitySelected.emit(this.findidentityById(this.identities, event.target.value)); // Emitir el evento con la categoría seleccionada
    
    this.identity_id = event.target.value; // Obtiene el valor seleccionado
    this.onChange(this.identity_id); // Llama a la función de cambio con el nuevo valor
  }

}
