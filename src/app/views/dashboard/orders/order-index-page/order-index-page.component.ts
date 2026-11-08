import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { ORDER_STATUS_OPTIONS, OrderListItem, OrderPage, OrderStatus } from 'src/app/interfaces/order.interface';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { OrderIndexComponent } from '../order-index/order-index.component';
import { OrderService } from '../order.service';

type LoadState = 'idle' | 'initial' | 'more';

@Component({
  selector: 'app-order-index-page',
  imports: [OrderIndexComponent, RouterLink, LoadingComponent],
  templateUrl: './order-index-page.component.html',
  styleUrl: './order-index-page.component.scss',
})
export class OrderIndexPageComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);
  private loadState: LoadState = 'idle';
  private requestedPage = 1;

  readonly statusOptions = ORDER_STATUS_OPTIONS;
  readonly deliveryOptions = [
    { value: 'express', label: 'Envío express' },
    { value: 'agency', label: 'Envío por agencia' },
    { value: 'store_pickup', label: 'Recojo en tienda' },
  ];
  orders: OrderListItem[] = [];
  status: OrderStatus | '' = '';
  search = '';
  delivery = '';
  page = 0;
  total: number | null = null;
  hasMore = true;
  error = '';

  get loading(): boolean { return this.loadState === 'initial'; }
  get loadingMore(): boolean { return this.loadState === 'more'; }
  get isLoading(): boolean { return this.loadState !== 'idle'; }
  get canLoadMore(): boolean { return this.hasMore && !this.error; }
  get hasLocalFilters(): boolean { return !!(this.search.trim() || this.delivery); }
  get hasActiveFilters(): boolean { return !!this.status || this.hasLocalFilters; }

  get filteredOrders(): OrderListItem[] {
    if (!this.hasLocalFilters) return this.orders;

    const search = this.normalizeSearch(this.search);

    return this.orders.filter(order => {
      const deliveryType = order.courier_address?.addressable?.delivery_type ?? 'store_pickup';
      if (this.delivery && deliveryType !== this.delivery) return false;
      if (!search) return true;

      const customer = order.addresses?.find(address => address.purpose === 'shipping');
      const text = [
        `#${order.id}`, order.shopify_order_name, customer?.name,
        customer?.phone, customer?.document_number,
      ].join(' ');

      return this.normalizeSearch(text).includes(search);
    });
  }

  clearFilters(): void {
    if (this.isLoading) return;
    this.search = '';
    this.delivery = '';
    this.changeStatus('');
  }

  private normalizeSearch(value: string): string {
    return value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  get summaryCards() {
    let pendingPayment = 0;
    let preparing = 0;
    let shipped = 0;

    for (const order of this.orders) {
      if (order.status === 'registrado' || order.status === 'pago_recibido') pendingPayment++;
      if (order.status === 'preparacion') preparing++;
      if (order.status === 'enviado') shipped++;
    }

    return [
      { label: 'Total de pedidos', value: this.total ?? this.orders.length, icon: 'fa-bag-shopping', description: this.status ? 'Con el filtro actual' : this.total === null ? 'Pedidos cargados' : 'Todos los pedidos' },
      { label: 'Por confirmar pago', value: pendingPayment, icon: 'fa-wallet', description: 'En los pedidos cargados' },
      { label: 'En preparación', value: preparing, icon: 'fa-box-open', description: 'En los pedidos cargados' },
      { label: 'Enviados', value: shipped, icon: 'fa-truck-fast', description: 'En los pedidos cargados' },
    ];
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadMoreOrders(): void {
    if (this.canLoadMore) this.loadPage(this.page + 1);
  }

  changeStatus(value: string): void {
    const status = value === '' ? '' : this.statusOptions.find(option => option.value === value)?.value;
    if (status === undefined || status === this.status || this.isLoading) return;

    this.status = status;
    this.orders = [];
    this.page = 0;
    this.total = null;
    this.hasMore = true;
    this.loadPage(1);
  }

  retry(): void {
    this.loadPage(this.requestedPage);
  }

  private loadPage(page: number): void {
    if (this.isLoading) return;

    this.requestedPage = page;
    this.loadState = page === 1 ? 'initial' : 'more';
    this.error = '';

    this.orderService.list(page, this.status || undefined).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loadState = 'idle'),
    ).subscribe({
      next: result => this.applyPage(result, page),
      error: () => {
        this.error = page === 1
          ? 'No se pudieron cargar los pedidos. Intenta nuevamente.'
          : 'No se pudieron cargar más pedidos. Puedes reintentar.';
      },
    });
  }

  private applyPage(result: OrderPage, page: number): void {
    const previousOrders = page === 1 ? [] : this.orders;
    const knownIds = new Set(previousOrders.map(order => order.id));
    const newOrders = result.orders.filter(order => {
      if (knownIds.has(order.id)) return false;
      knownIds.add(order.id);
      return true;
    });

    this.orders = [...previousOrders, ...newOrders];
    this.page = page;
    this.total = result.total;
    this.hasMore = result.hasMore && newOrders.length > 0;
  }
}
