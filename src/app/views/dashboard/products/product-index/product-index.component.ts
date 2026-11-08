import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
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
    CurrencyPipe,
    DateShopifyPipe
  ],
  templateUrl: './product-index.component.html',
  styleUrl: './product-index.component.scss'
})
export class ProductIndexComponent implements AfterViewInit, OnDestroy {

  faTrash = faTrash;
  faPen = faPen;
  duplicating = false;
  private readonly destroy$ = new Subject<void>();

  /** funcion que detectas si se llego al final */

  @Output() loadMore = new EventEmitter<void>();

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
    this.router.navigate([this._base.store, 'dashboard', 'products', id]);
  }

  async duplicateProduct(product: Product): Promise<void> {
    if (this.duplicating) return;
    this.duplicating = true;
    try {
      const result = await Swal.fire<Product>({
        title: 'Duplicar producto',
        text: 'Edita el nombre de la copia. Se copiarán sus propiedades e imágenes con nuevos IDs y stock en cero.',
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
      if (result.isConfirmed && result.value) { this.getProduct(result.value.id); }
    } finally {
      this.duplicating = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.duplicating) { Swal.close(); }
    this.observer?.disconnect();
  }

}
