import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CategoryService } from '../category.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormSelectDirective } from '@coreui/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-selected',
  imports: [ReactiveFormsModule, FormSelectDirective, CommonModule],
  templateUrl: './category-selected.component.html',
  styleUrl: './category-selected.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategorySelectedComponent),
      multi: true,
    },
  ],
})
export class CategorySelectedComponent implements OnInit, ControlValueAccessor {
  constructor(private _category: CategoryService) {}

  @Input() categories: any[] = [];
  loading: boolean = true;
  category_id: number | null = null;
  @Output() emitCategorySelected = new EventEmitter<[]>();
  
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

  findCategoryById(items: any[], id: number): any | undefined {
    for (const item of items) {
      // console.log(item);

      // console.log(item.id);
      
      
      if (item.id == id) {
        return item;
      }
  
      if (item.children) {
        const found = this.findCategoryById(item.children, id);
        if (found) {
          return found;
        }
      }
    }
  
    return undefined;
  }

  onCategoryChange(event: any) {
    console.log(event.target.value); // Imprime el valor seleccionado en la consola
    // console.log(event.target); // Imprime el valor seleccionado en la consola
    // console.log(this.findCategoryById(this.categories, event.target.value));

    this.emitCategorySelected.emit(this.findCategoryById(this.categories, event.target.value)); // Emitir el evento con la categoría seleccionada
    
    this.category_id = event.target.value; // Obtiene el valor seleccionado
    this.onChange(this.category_id); // Llama a la función de cambio con el nuevo valor
  }
}
