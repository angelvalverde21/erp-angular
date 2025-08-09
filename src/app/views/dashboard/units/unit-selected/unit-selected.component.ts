import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormSelectDirective } from '@coreui/angular';

@Component({
  selector: 'app-unit-selected',
  imports: [ReactiveFormsModule, FormSelectDirective],
  templateUrl: './unit-selected.component.html',
  styleUrl: './unit-selected.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UnitSelectedComponent),
      multi: true,
    },
  ],
})
export class UnitSelectedComponent implements OnInit, ControlValueAccessor {
  constructor() {}

  @Input() units: any[] = [];
  loading: boolean = true;
  unit_id: number | null = null;
  @Output() emitUnitSelected = new EventEmitter<[]>();
  
  ngOnInit(): void {
    // Initialization logic here
    //cargar categorias

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

  findUnitById(items: any[], id: number): any | undefined {
    for (const item of items) {
      // console.log(item);
      if (item.id == id) {
        return item;
      }
  
    }
  
    return undefined;
  }

  onUnitChange(event: any) {
    console.log(event.target.value); // Imprime el valor seleccionado en la consola
    // console.log(event.target); // Imprime el valor seleccionado en la consola
    // console.log(this.findunitById(this.units, event.target.value));

    this.emitUnitSelected.emit(this.findUnitById(this.units, event.target.value)); // Emitir el evento con la categoría seleccionada
    
    this.unit_id = event.target.value; // Obtiene el valor seleccionado
    this.onChange(this.unit_id); // Llama a la función de cambio con el nuevo valor
  }
}
