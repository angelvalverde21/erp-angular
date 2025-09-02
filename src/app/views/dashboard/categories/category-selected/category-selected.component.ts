import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Category } from '../../../../interfaces/category.interface';

@Component({
  selector: 'app-category-selected',
  imports: [FormsModule],
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

  @Input() categories: Category[] = [];
  loading: boolean = true;
  category_id: number | null = null;
  @Output() emitCategorySelected = new EventEmitter<Category>();

  ngOnInit(): void {
    // Initialization logic here
    //cargar categorias
  }

  value: string = '';

  private onChangeFn: (value: any) => void = () => { };
  private onTouchedFn: () => void = () => { };

  // Se llama cuando el valor externo cambia (ej. setValue)
  writeValue(value: any): void {
    
    this.value = value != null ? value : null;
    console.log(value);

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
    const id = event.target.value;
    this.value = id;

    const category = this.findCategoryById(this.categories, id);
    this.emitCategorySelected.emit(category);

    this.onChangeFn(id);
    this.onTouchedFn();
  }

}
