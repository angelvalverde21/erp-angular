import { ProductShopifyBulkComponent } from '../product-shopify-bulk/product-shopify-bulk.component';
import { afterNextRender, inject, Injector, OnChanges, SimpleChanges, AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Product } from 'src/app/interfaces/product.interface';
import { BaseService } from 'src/app/views/base.service';
import { DateShopifyPipe } from '@shared/pipes/date-shopify.pipe';
import { CurrencyPipe } from '@angular/common';
import { ProductSort, ProductSortDirection } from 'src/app/interfaces/product-list.interface';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-index',
  imports: [
    ProductShopifyBulkComponent,
    CurrencyPipe,
    DateShopifyPipe
  ],
  templateUrl: './product-index.component.html',
  styleUrl: './product-index.component.scss'
})
export class ProductIndexComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() bulkActions = false;
  selectedIds = new Set<number>();
  bulkBusy = false;
  updateShopifyLink(event: { productId: number; linked: boolean }): void {
    const product = this.products.find(product => product.id === event.productId);
    if (product) product.shopify_linked = event.linked;
  }
  get selectedProducts(): Product[] { return this.products.filter(product => this.selectedIds.has(product.id)); }
  get allProductsSelected(): boolean { return this.products.length > 0 && this.products.slice(0, 30).every(product => this.selectedIds.has(product.id)); }
  toggleProduct(id: number): void {
    if (this.bulkBusy) return;
    const next = new Set(this.selectedIds);
    if (next.has(id)) next.delete(id); else if (next.size < 30) next.add(id);
    this.selectedIds = next;
  }
  toggleProducts(): void {
    if (this.bulkBusy) return;
    this.selectedIds = this.allProductsSelected ? new Set() : new Set(this.products.slice(0, 30).map(product => product.id));
  }
  clearProducts(): void { if (!this.bulkBusy) this.selectedIds = new Set(); }

  faTrash = faTrash;
  faPen = faPen;
  duplicating = false;
  @Input() insertedProductId: number | null = null;
  highlightedId: number | null = null;
  insertionMessage = '';
  private highlightTimer?: ReturnType<typeof setTimeout>;
  private readonly host = inject(ElementRef<HTMLElement>, { optional: true });
  private readonly injector = inject(Injector);
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) { const visible = new Set(this.products.map(product => product.id)); this.selectedIds = new Set([...this.selectedIds].filter(id => visible.has(id))); }
    if (!changes['insertedProductId'] || this.insertedProductId == null) return;
    if (this.highlightTimer) clearTimeout(this.highlightTimer);
    this.highlightedId = this.insertedProductId;
    const product = this.products.find(item => item.id === this.insertedProductId);
    this.insertionMessage = 'Producto insertado: ' + (product?.name || 'nueva copia');
    const id = this.insertedProductId;
    afterNextRender(() => {
      const row = this.host?.nativeElement.querySelector('[data-product-id="' + id + '"]') as HTMLElement | undefined;
      if (!row || this.highlightedId !== id) return;
      const bounds = row.getBoundingClientRect();
      if (bounds.top < 0 || bounds.bottom > window.innerHeight) row.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
    }, { injector: this.injector });
    this.highlightTimer = setTimeout(() => { this.highlightedId = null; this.insertionMessage = ''; }, 3500);
  }

  private readonly destroy$ = new Subject<void>();

  /** funcion que detectas si se llego al final */

  @Output() loadMore = new EventEmitter<void>();
  @Output() productDuplicated = new EventEmitter<Product>();

  @ViewChild('bottom', { static: true }) bottom!: ElementRef;

  observer!: IntersectionObserver;

  ngAfterViewInit(): void {

    this.observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.loadMore.emit(); // 🔥 avisar al padre
      }
    });

    this.observer.observe(this.bottom.nativeElement);

  }

  /** fin funcion que detectas si se llego al final */

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _base: BaseService,
    private productService: ProductService,
  ) {

  }

  @Input() products: Product[] = [];
  @Input() sortable = false;
  @Input() sortBy: ProductSort | null = null;
  @Input() sortDirection: ProductSortDirection = 'desc';
  @Input() loading = false;
  @Output() sortChange = new EventEmitter<ProductSort>();

  columnSort(field: ProductSort): 'ascending' | 'descending' | 'none' | null {
    if (!this.sortable) return null;
    if (this.sortBy !== field) return 'none';
    return this.sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  sortIcon(field: ProductSort): string {
    if (this.sortBy !== field) return 'fa-solid fa-sort';
    return this.sortDirection === 'asc' ? 'fa-solid fa-arrow-up' : 'fa-solid fa-arrow-down';
  }

  getProduct(id: number) {
    if (this.bulkBusy) return;
    this.router.navigate([this._base.store, 'dashboard', 'products', id]);
  }

  async duplicateProduct(product: Product): Promise<void> {
    if (this.duplicating || this.bulkBusy) return;
    this.duplicating = true;
    try {
      const result = await Swal.fire<Product>({
        title: 'Duplicar producto',
        text: 'Edita el nombre de la copia. Se copiarán sus propiedades con nuevos IDs y stock en cero. La copia quedará sin imágenes para que agregues las nuevas.',
        input: 'text',
        inputValue: product.name ?? '',
        inputLabel: 'Nombre del nuevo producto',
        inputAttributes: { maxlength: '255', autocomplete: 'off' },
        showCancelButton: true,
        confirmButtonText: 'Duplicar producto',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Swal.isLoading(),
        allowEscapeKey: () => !Swal.isLoading(),
        inputValidator: value => !value.trim() ? 'Ingresa el nombre del nuevo producto.' : undefined,
        preConfirm: async (value: string) => {
          try {
            const response = await firstValueFrom(this.productService.duplicate(product.id, value.trim()).pipe(takeUntil(this.destroy$)));
            return response.data;
          } catch (error: any) {
            const message = document.createElement('span');
            message.textContent = error.error?.errors
              ? Object.values(error.error.errors).flat().join(' ')
              : 'No se pudo duplicar el producto. Intenta nuevamente.';
            Swal.showValidationMessage(message.innerHTML);
            return false;
          }
        },
      });
      if (result.isConfirmed && result.value) { this.productDuplicated.emit(result.value); }
    } finally {
      this.duplicating = false;
    }
  }

  ngOnDestroy(): void {
    if (this.highlightTimer) clearTimeout(this.highlightTimer);
    this.destroy$.next();
    this.destroy$.complete();
    if (this.duplicating) { Swal.close(); }
    this.observer?.disconnect();
  }

}
