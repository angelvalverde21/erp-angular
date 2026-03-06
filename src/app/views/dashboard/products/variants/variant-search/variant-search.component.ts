import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { VariantIndexComponent } from '../variant-index/variant-index.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../products/product.service';
import Swal from 'sweetalert2';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { VoidIndexComponent } from '@shared/components/void-index/void-index.component';
import { VariantIndexSelectedComponent } from '../variant-index-selected/variant-index-selected.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';

@Component({
  selector: 'app-variant-search',
  imports: [
    InputGroupComponent,
    VariantIndexComponent,
    FormsModule,
    ButtonComponent,
    ReactiveFormsModule,
    VoidIndexComponent,
    VariantIndexSelectedComponent,
    LoadingComponent
  ],
  templateUrl: './variant-search.component.html',
  styleUrl: './variant-search.component.scss'
})
export class VariantSearchComponent implements OnInit {

  search$ = new Subject<string>();
  products: any;
  variants: any;
  @Output() emitVariantsSelected = new EventEmitter<any[]>();

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
        Swal.fire('Error', 'Ocurrió un problema al crear. Inténtalo nuevamente.', 'error');
        console.error(error);
      },

    });
  }

  destroy$ = new Subject<void>();

  ngOnDestroy(): void {

    this.destroy$.next();
    this.destroy$.complete();

  }

  selected_variants: any = {};

  receiveSelectedVariants(variants: any) {

    console.log("Selected variants:", variants);
    this.selected_variants = variants;

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
      console.log("Adding variants:", this.selected_variants);
      console.log("Adding variants:", this.variantsSelected);
      this.emitVariantsSelected.emit(this.variantsSelected);
    }

  }

  variantsSelected: any;

  receiveVariantsSelected(variantsSelected: any){
    // this.emitVariantsSelected.emit(variantsSelected);
    console.log("Received variants selected:", variantsSelected);
    this.variantsSelected = variantsSelected;
  }

}
