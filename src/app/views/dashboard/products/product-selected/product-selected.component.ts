import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../product.service';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { InputGroupComponent } from '../../../shared/components/form/input-group/input-group.component';
import { faEdit } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-product-selected',
  imports: [
    LoadingComponent, 
    FormsModule,
    InputGroupComponent,
    ReactiveFormsModule
  ],
  templateUrl: './product-selected.component.html',
  styleUrl: './product-selected.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductSelectedComponent),
      multi: true,
    },
  ],
})

export class ProductSelectedComponent implements OnInit, ControlValueAccessor {

  faEdit= faEdit;

  //Definimos el Observable dentro del la clase
  //ejemplo dentro de export class InputColorSizeComponent{}
  inputSubject: Subject<string> = new Subject();
  //Luego definimos el observador en si
  
  private destroy$ = new Subject<void>();

  constructor(private _product: ProductService) {}

  @Input() products: any[] = [];
  // loading: boolean = true;
  product_id: number | null = null;
  @Output() emitProductSelected = new EventEmitter<[]>();

  ngOnInit(): void {

    this.inputSubject.pipe(debounceTime(500)).subscribe((search: string) => {
        this.search(search);
    });

  }

  loading: boolean = false;
  private pendingValue: any = null;

  inputSearch(event:any){
    this.inputSubject.next(event?.target.value);
  }

  search(value: string){

    console.log();
    

    this.loading = true;
    
    this._product.search(value).pipe(takeUntil(this.destroy$)).subscribe({

        next: (resp: any) => {
          this.products = resp.data;
          console.log(this.products);
          this.loading = false;

          // Si había un valor pendiente, lo aplicamos ahora
          if (this.pendingValue !== null) {
            // console.log("hola");
            // console.log(this.pendingValue);
            
            this.value = this.pendingValue;
            this.pendingValue = null;
          }
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
    if (this.products.length > 0) {
      // Si ya hay unidades cargadas, se asigna de inmediato
      this.value = value;
    } else {
      // Si aún no hay datos, lo guardamos para aplicarlo después
      this.pendingValue = value;
    }
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
    console.log('onChange');
  }

  onTouched() {
    this.onTouchedFn();
  }

  findProductById(items: any[], id: number): any | undefined {
    for (const item of items) {
      // console.log(item);
      if (item.id == id) {
        return item;
      }
    }

    return undefined;
  }

  onProductChange(event: any) {
    console.log(event.target.value); // Imprime el valor seleccionado en la consola
    // console.log(event.target); // Imprime el valor seleccionado en la consola
    // console.log(this.findproductById(this.products, event.target.value));

    this.emitProductSelected.emit(
      this.findProductById(this.products, event.target.value)
    ); // Emitir el evento con la categoría seleccionada

    this.product_id = event.target.value; // Obtiene el valor seleccionado
    this.onChange(this.product_id); // Llama a la función de cambio con el nuevo valor
    console.log('seleccionado');
  }
}
