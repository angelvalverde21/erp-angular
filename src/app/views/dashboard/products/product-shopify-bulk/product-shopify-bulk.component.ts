import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild, inject } from '@angular/core';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { Product } from 'src/app/interfaces/product.interface';
import { CatalogPreview, CatalogPreviewItem, CatalogPublishResult, ShopifyCatalogService } from '../shopify-catalog.service';

@Component({ selector: 'app-product-shopify-bulk', standalone: true, templateUrl: './product-shopify-bulk.component.html', styleUrl: './product-shopify-bulk.component.scss' })
export class ProductShopifyBulkComponent implements OnDestroy {
  @Input() products: Product[] = [];
  @Output() clearSelection = new EventEmitter<void>();
  @Output() busyChanged = new EventEmitter<boolean>();
  @ViewChild('reviewDialog') dialog?: ElementRef<HTMLDialogElement>;
  private readonly service = inject(ShopifyCatalogService);
  private readonly destroy$ = new Subject<void>();
  private destroyed = false;
  preview: CatalogPreview | null = null;
  results: Record<number, CatalogPublishResult | { status: 'sending'; message: string }> = {};
  loading = false;
  sending = false;
  error = '';
  get readyItems(): CatalogPreviewItem[] { return this.preview?.items.filter(item => item.status === 'ready' && !!item.token) ?? []; }
  get pendingItems(): CatalogPreviewItem[] { return this.readyItems.filter(item => this.results[item.id]?.status !== 'synced'); }
  get finished(): number { return Object.values(this.results).filter(result => result.status !== 'sending').length; }
  get successCount(): number { return Object.values(this.results).filter(result => result.status === 'synced').length; }
  get failedCount(): number { return Object.values(this.results).filter(result => result.status === 'failed').length; }
  async open(): Promise<void> {
    if (!this.products.length || this.sending || this.loading) return;
    this.busyChanged.emit(true);
    if (!this.dialog?.nativeElement.open) this.dialog?.nativeElement.showModal();
    this.loading = true; this.error = ''; this.preview = null; this.results = {};
    try { this.preview = (await firstValueFrom(this.service.preview(this.products.map(product => product.id)).pipe(takeUntil(this.destroy$)))).data; }
    catch (error) { if (!this.destroyed) this.error = this.errorMessage(error); }
    finally { this.loading = false; }
  }
  close(): void { if (this.sending) return; this.dialog?.nativeElement.close(); this.busyChanged.emit(false); }
  cancel(event: Event): void { if (this.sending) event.preventDefault(); }
  async publish(): Promise<void> {
    if (this.sending || this.loading || !this.preview?.connection.ready || !this.pendingItems.length) return;
    this.sending = true; this.error = '';
    const items = [...this.pendingItems];
    try {
      for (const item of items) {
        if (this.destroyed) break;
        this.results = { ...this.results, [item.id]: { status: 'sending', message: 'Enviando…' } };
        try {
          const response = await firstValueFrom(this.service.publish(item.id, item.token!).pipe(takeUntil(this.destroy$)));
          this.results = { ...this.results, [item.id]: response.data };
        } catch (error) {
          if (!this.destroyed) this.results = { ...this.results, [item.id]: { product_id: item.id, status: 'failed', message: this.errorMessage(error) } };
        }
      }
    } finally { this.sending = false; }
  }
  rowLabel(item: CatalogPreviewItem): string {
    const status = this.results[item.id]?.status;
    if (status === 'synced') return 'Creado en Shopify';
    if (status === 'sending') return 'Enviando';
    if (status === 'failed') return 'Revisar envío';
    return item.status === 'linked' ? 'Ya vinculado' : item.status === 'invalid' ? 'Requiere revisión' : 'Listo para enviar';
  }
  variantLabel(item: CatalogPreviewItem): string { return item.variants.map(variant => variant.optionValues.map(value => value.name).join(' / ')).join(' · '); }
  private errorMessage(error: any): string {
    if (error?.status === 403) return 'No tienes permiso para publicar productos de esta tienda.';
    if (error?.status >= 500) return 'No se pudo confirmar la solicitud. Puedes reintentar sin duplicar el producto.';
    return error?.error?.errors ? Object.values(error.error.errors).flat().join(' ') : error?.error?.message || 'No se pudo completar la solicitud. Intenta nuevamente.';
  }
  ngOnDestroy(): void { this.destroyed = true; this.destroy$.next(); this.destroy$.complete(); this.dialog?.nativeElement.close(); }
}
