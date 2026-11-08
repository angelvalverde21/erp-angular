import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, ViewChild, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseService } from 'src/app/views/base.service';

@Component({
  selector: 'app-order-index',
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './order-index.component.html',
  styleUrl: './order-index.component.scss'
})
export class OrderIndexComponent implements AfterViewInit, OnChanges, OnDestroy {
  readonly base = inject(BaseService);
  @Input() orders: any[] = [];
  @Input() loading = false;
  @Input() hasMore = true;
  @Output() loadMore = new EventEmitter<void>();
  @ViewChild('bottom', { static: true }) bottom!: ElementRef<HTMLElement>;
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    this.observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting) && this.hasMore && !this.loading && this.orders.length) {
        this.loadMore.emit();
      }
    }, { rootMargin: '150px' });
    this.observeBottom();
  }

  ngOnChanges(): void { this.observeBottom(); }

  private observeBottom(): void {
    if (!this.observer || !this.bottom) return;
    this.observer.unobserve(this.bottom.nativeElement);
    if (this.hasMore && !this.loading) this.observer.observe(this.bottom.nativeElement);
  }

  address(order: any): any {
    return order.addresses?.find((address: any) => address.purpose === 'shipping');
  }

  units(order: any): number {
    return (order.variants ?? []).reduce((sum: number, variant: any) => sum + Number(variant.quantity || 0), 0);
  }

  deliveryLabel(order: any): string {
    const type = order.courier_address?.addressable?.delivery_type;
    return type == null ? 'Recojo en tienda' : type === 'agency' ? 'Envío por agencia'
      : type === 'express' ? 'Envío express' : 'Envío';
  }

  statusLabel(status: string): string {
    const labels: Record<string, string> = {
      registrado: 'Registrado', pago_recibido: 'Pago recibido', pago_confirmado: 'Pago confirmado',
      preparacion: 'En preparación', enviado: 'Enviado', cancelado: 'Cancelado', en_espera: 'En espera',
    };
    return labels[status] ?? status ?? 'Sin estado';
  }

  statusClass(status: string): string {
    switch (status) {
      case 'registrado':
      case 'pago_recibido': return 'bg-warning-subtle text-warning-emphasis';
      case 'pago_confirmado': return 'bg-success-subtle text-success-emphasis';
      case 'preparacion': return 'bg-primary-subtle text-primary-emphasis';
      case 'enviado': return 'bg-info-subtle text-info-emphasis';
      case 'cancelado': return 'bg-danger-subtle text-danger-emphasis';
      default: return 'bg-secondary-subtle text-secondary-emphasis';
    }
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
