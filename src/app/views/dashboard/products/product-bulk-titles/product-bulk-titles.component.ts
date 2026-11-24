import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/interfaces/product.interface';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-bulk-titles',
  imports: [FormsModule],
  templateUrl: './product-bulk-titles.component.html',
  styleUrls: ['../product-shopify-bulk/product-shopify-bulk.component.scss', './product-bulk-titles.component.scss'],
})
export class ProductBulkTitlesComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() products: Product[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<{ id: number; name: string }[]>();
  @ViewChild('editor', { static: true }) editor!: ElementRef<HTMLDialogElement>;
  private readonly service = inject(ProductService);
  private readonly destroy$ = new Subject<void>();
  private destroyed = false;
  rows: { id: number; original: string; name: string }[] = [];
  find = '';
  replacement = '';
  prefix = '';
  suffix = '';
  saving = false;
  error = '';

  ngOnInit(): void {
    this.rows = this.products.map(product => ({ id: product.id, original: product.name ?? '', name: product.name ?? '' }));
  }

  ngAfterViewInit(): void { this.editor.nativeElement.showModal(); }

  get changes(): { id: number; name: string }[] {
    return this.rows.filter(row => row.name.trim() !== row.original).map(row => ({ id: row.id, name: row.name.trim() }));
  }

  get invalid(): boolean { return this.rows.some(row => !row.name.trim() || Array.from(row.name.trim()).length > 255); }

  apply(): void {
    if (this.saving) return;
    this.rows = this.rows.map(row => ({ ...row, name: this.prefix + (this.find ? row.name.split(this.find).join(this.replacement) : row.name) + this.suffix }));
    this.find = ''; this.replacement = ''; this.prefix = ''; this.suffix = '';
  }

  restore(): void { if (!this.saving) this.rows = this.rows.map(row => ({ ...row, name: row.original })); }
  close(): void { if (!this.saving) this.editor.nativeElement.close(); }
  cancel(event: Event): void { if (this.saving) event.preventDefault(); }

  async save(): Promise<void> {
    if (this.saving || this.invalid || !this.changes.length) return;
    this.saving = true; this.error = '';
    try {
      const response = await firstValueFrom(this.service.updateTitles(this.changes).pipe(takeUntil(this.destroy$)));
      if (this.destroyed) return;
      this.saved.emit(response.data);
      this.editor.nativeElement.close();
    } catch (error: any) {
      if (!this.destroyed) this.error = error?.error?.errors
        ? Object.values(error.error.errors).flat().join(' ')
        : 'No se pudieron guardar los títulos. Tus cambios siguen aquí para reintentar.';
    } finally { this.saving = false; }
  }

  ngOnDestroy(): void { this.destroyed = true; this.destroy$.next(); this.destroy$.complete(); this.editor.nativeElement.close(); }
}
