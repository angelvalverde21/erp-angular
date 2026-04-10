import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { InventoryVariantIndexComponent } from '../inventory-variant-index/inventory-variant-index.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../products/product.service';
import Swal from 'sweetalert2';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { VoidIndexComponent } from '@shared/components/void-index/void-index.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-inventory-variant-search',
  imports: [
    InputGroupComponent,
    InventoryVariantIndexComponent,
    FormsModule,
    ButtonComponent,
    ReactiveFormsModule,
    VoidIndexComponent,
    LoadingComponent
  ],
  templateUrl: './inventory-variant-search.component.html',
  styleUrl: './inventory-variant-search.component.scss'
})
export class InventoryVariantSearchComponent implements OnInit {

  search$ = new Subject<string>();
  products: any;
  variants: any;
  @Output() emitInventoryVariantsSelected = new EventEmitter<any[]>();

  buttonDisabled: boolean = true;

  form!: FormGroup;

  constructor(
    private _product: ProductService,
    private fb: FormBuilder
  ) {

  }

  loading: boolean = false;

  ngOnInit(): void {

    this.form = this.fb.group({
      search: ['']
    });

    // this.search$
    //   .pipe(debounceTime(300))
    //   .subscribe(value => {
    //     this.getSearch(value);
    //   });
    this.form.get('search')?.valueChanges.pipe(debounceTime(300)).subscribe(value => {
      this.getSearch();
    });
  }

  faMagnifyingGlass = faMagnifyingGlass;

  search: string = '';

  // onSearchChange(value: string) {
  //   this.search$.next(value);
  // }

  getSearch() {

    if (!this.form.get('search')?.value) {
      this.products = [];
      this.variants = [];
      return;
    }

    this.loading = true;

    this._product.search(this.form.value).pipe(takeUntil(this.destroy$)).subscribe({

      next: (resp: any) => {
        console.log(resp);
        this.products = resp.data;
        this.variants = this.products.flatMap((product: any) => product.variants);
        // this.variants = this.products;
        this.loading = false;
      },

      error: (error: any) => {
        Swal.fire('Error', 'Ocurrio un problema al buscar. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  selected_inventory_variants: any = {};

  receiveSelectedInventoryVariants(variants: any) {

    console.log("Selected variants:", variants);
    this.selected_inventory_variants = variants;

    if (Object.keys(variants).length > 0) {
      this.buttonDisabled = false;
    } else {
      this.buttonDisabled = true;
    }

  }

  addVariants() {

    if (this.buttonDisabled) {
      return;
    } else {
      console.log("Adding variants:", this.selected_inventory_variants);
      console.log("Adding variants:", this.inventoryVariantsSelected);
      this.emitInventoryVariantsSelected.emit(this.inventoryVariantsSelected);
    }

  }

  inventoryVariantsSelected: any;

  receiveInventoryVariantsSelected(inventoryVariantsSelected: any){
    // this.emitInventoryVariantsSelected.emit(inventoryVariantsSelected);
    console.log("Received variants selected:", inventoryVariantsSelected);
    this.inventoryVariantsSelected = inventoryVariantsSelected;
  }

}



