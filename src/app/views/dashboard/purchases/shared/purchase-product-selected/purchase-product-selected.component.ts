import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { InputGroupComponent } from '../../../../shared/components/form/input-group/input-group.component';
import { faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../../../products/product.service';

@Component({
  selector: 'app-purchase-product-selected',
  imports: [
    LoadingComponent, 
    FormsModule,
    InputGroupComponent,
    ReactiveFormsModule
  ],
  templateUrl: './purchase-product-selected.component.html',
  styleUrl: './purchase-product-selected.component.scss',
})

export class PurchaseProductSelectedComponent implements OnInit {

  faSearch= faSearch;

  //Definimos el Observable dentro del la clase
  //ejemplo dentro de export class InputColorSizeComponent{}
  inputSubject: Subject<string> = new Subject();
  //Luego definimos el observador en si
  
  private destroy$ = new Subject<void>();

  constructor(private _product: ProductService) {}

  @Input() products: any[] = [];
  @Input() text: string = 'Producto (*)';
  @Input() show_result:boolean = true;
  product_id: number | null = null;
  @Output() emitProductSelected = new EventEmitter<[]>();
  @Output() emitProductSizeSelected = new EventEmitter<[]>();
  @Output() emitSearchResult = new EventEmitter<any[]>();

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

          this.emitSearchResult.emit(this.products);

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
    console.log('seleccionado');
  }

  selectProduct(product: any, size: any){
    
    const productWithSize = {
      ...size,
      'image': product.image.url_thumbnail,
      'title': product.name
    };

    this.emitProductSizeSelected.emit(productWithSize)

    console.log(productWithSize);
    
  }
}
