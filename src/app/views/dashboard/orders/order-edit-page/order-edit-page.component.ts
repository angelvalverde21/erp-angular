import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { OrderService } from '../order.service';
import { OrderEditComponent } from '../order-edit/order-edit.component';

@Component({
  selector: 'app-order-edit-page',
  imports: [RouterLink, OrderEditComponent],
  templateUrl: './order-edit-page.component.html',
  styleUrl: './order-edit-page.component.scss'
})
export class OrderEditPageComponent implements OnInit, OnDestroy {
  order_id = '';
  order: any = null;
  loading = false;
  error = '';
  private readonly destroy$ = new Subject<void>();
  private request?: Subscription;

  constructor(private route: ActivatedRoute, private orders: OrderService) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.order_id = params.get('order_id') ?? '';
      this.loadOrder();
    });
  }

  loadOrder(): void {
    this.request?.unsubscribe();
    this.order = null;
    this.error = '';
    if (!this.order_id) {
      this.error = 'No se encontró el identificador del pedido.';
      return;
    }
    this.loading = true;
    this.request = this.orders.get(this.order_id).pipe(
      catchError(() => {
        this.error = 'No se pudo cargar el pedido. Inténtalo nuevamente.';
        return of(null);
      }),
      takeUntil(this.destroy$),
      finalize(() => this.loading = false),
    ).subscribe(response => {
      this.order = response?.data ?? null;
      console.log(this.order);
      
      if (!this.order && !this.error) this.error = 'El pedido no está disponible.';
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
