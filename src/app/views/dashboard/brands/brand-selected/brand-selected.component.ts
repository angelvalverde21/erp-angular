import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Brand } from '../../../../interfaces/brand.interface';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-brand-selected',
  imports: [FormsModule, InputGroupComponent, NgSelectModule],
  templateUrl: './brand-selected.component.html',
  styleUrl: './brand-selected.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrandSelectedComponent),
      multi: true,
    },
  ],
})
export class BrandSelectedComponent implements OnInit, ControlValueAccessor {

  @Input() brands: Brand[] = [];
  loading: boolean = true;
  brand_id: number | null = null;
  @Output() emitBrandSelected = new EventEmitter<Brand>();

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

  findBrandById(items: any[], id: number): any | undefined {
    for (const item of items) {
      // console.log(item);

      // console.log(item.id);

      if (item.id == id) {
        return item;
      }

      if (item.children) {
        const found = this.findBrandById(item.children, id);
        if (found) {
          return found;
        }
      }
    }

    return undefined;
  }

  onBrandChange(event: any) {

    console.log(event);

    if (event != null) {
      const id = event.id;
      this.value = id;

      const brand = this.findBrandById(this.brands, id);
      this.emitBrandSelected.emit(brand);

      this.onChangeFn(id);
      this.onTouchedFn();
    }

  }

}
