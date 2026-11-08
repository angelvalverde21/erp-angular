import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { VariantIndexComponent } from '../variant-index/variant-index.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subject, Subscription, takeUntil } from 'rxjs';
import { ProductService } from '../../../products/product.service';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { VariantIndexFormComponent } from '../variant-index-form/variant-index-form.component';

@Component({
  selector: 'app-variant-search',
  imports: [
    VariantIndexComponent,
    ReactiveFormsModule,
    LoadingComponent,
    VariantIndexFormComponent,
  ],
  templateUrl: './variant-search.component.html',
  styleUrl: './variant-search.component.scss'
})
export class VariantSearchComponent implements OnInit, OnDestroy {

  private static nextId = 0;
  readonly searchId = `variant-search-${VariantSearchComponent.nextId++}`;
  private searchRequest?: Subscription;
  searchError = false;
  products: any[] = [];
  variants: any[] = [];
  @Output() emitVariantsSelected = new EventEmitter<any[]>();

  @Input() type_form: boolean = false; //indica que el tipo de listado que desplegara sera del tipo formulario para que el cliente pueda seleccionar la cantidad de cada variante que desea agregar al lote, en lugar de solo seleccionar las variantes.

  @Input() title: string = 'Agregar seleccionados';

  buttonDisabled: boolean = true;

  form!: FormGroup;

  constructor(
    private _product: ProductService,
    private fb: FormBuilder
  ) {

  }

  loading: boolean = false;

  ngOnInit(): void {
    this.form = this.fb.group({ search: [''] });
    this.form.get('search')!.valueChanges.pipe(
      debounceTime(300), takeUntil(this.destroy$),
    ).subscribe(() => this.getSearch());
  }

  receiveFormValuesChanged(data: any): void {
    this.buttonDisabled = data.status !== 'VALID';
  }

  clearSearch(): void {
    this.form.get('search')!.setValue('', { emitEvent: false });
    this.getSearch();
  }

  getSearch(): void {
    this.searchRequest?.unsubscribe();
    this.products = [];
    this.variants = [];
    this.selected_variants = {};
    this.variantsSelected = [];
    this.buttonDisabled = true;
    this.searchError = false;
    const search = String(this.form.get('search')?.value ?? '').trim();
    if (!search) {
      this.loading = false;
      return;
    }
    this.loading = true;
    this.searchRequest = this._product.search({ ...this.form.value, search }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp: any) => {
        this.products = resp.data ?? [];
        this.variants = this.products.flatMap((product: any) => product.variants ?? []);
        this.loading = false;
      },
      error: () => {
        this.searchError = true;
        this.loading = false;
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

      this.emitVariantsSelected.emit(this.variantsSelected);
    }

  }

  variantsSelected: any = [];

  receiveVariantsSelected(variantsSelected: any){
    this.variantsSelected = variantsSelected;
  }




}
