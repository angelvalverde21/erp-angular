import { Component, Input } from '@angular/core';
import { ImportedOrderItemImageComponent } from '../initial-import/orders/imported-order-item-image.component';
import { OrderProduct } from './order-workspace.model';

@Component({
  selector: 'app-order-product-list',
  imports: [ImportedOrderItemImageComponent],
  template: `
    <ul class="products" [class.with-prices]="showPrices">
      @for (product of products; track product.id) {
        <li>
          <span class="quantity" [class.multiple]="product.quantity > 1" [attr.aria-label]="product.quantity + ' unidades'">{{ product.quantity }}<span>×</span></span>
          <app-imported-order-item-image [image]="product.image" [title]="product.title" [compact]="compact" />
          <div class="description">
            <strong>{{ product.title }}</strong>
            @if (product.variant) { <span class="variant">{{ product.variant }}</span> }
            @if (product.sku && !compact) { <small>SKU: {{ product.sku }}</small> }
          </div>
          @if (showPrices) { <div class="price"><strong>{{ product.total }}</strong><small>{{ product.unitPrice }} c/u</small></div> }
        </li>
      } @empty { <li class="empty">No hay artículos vigentes disponibles.</li> }
    </ul>
  `,
  styles: `
    :host { display:block; } .products { list-style:none; padding:0; margin:0; }
    li { display:flex; align-items:center; gap:.7rem; padding:.55rem 0; } li + li { border-top:1px solid #e9edf5; }
    .quantity { display:flex; justify-content:center; align-items:center; gap:3px; flex:0 0 35px; padding:.4rem .2rem; border-radius:6px; color:#4e6380; font-size:1rem; font-weight:750; font-variant-numeric:tabular-nums; }
    .quantity span { font-size:.72rem; font-weight:500; } .multiple { color:#91601c; background:#fff1d6; }
    .description { min-width:0; flex:1; } strong { display:block; font-size:.8rem; line-height:1.5; font-weight:650; color:#283b55; }
    .variant { display:inline-block; margin-top:.2rem; padding:.15rem .4rem; border-radius:4px; color:#465e8c; background:#edf1f9; font-size:.72rem; font-weight:600; }
    small { display:block; margin-top:.3rem; color:#7b89a0; font-size:.69rem; } .price { text-align:right; white-space:nowrap; }
    .with-prices li { padding:1rem 0; } .with-prices strong { font-size:.85rem; } .empty { color:#7b89a0; font-size:.78rem; }
    @media(max-width:600px) { .with-prices li { flex-wrap:wrap; } .price { margin-left:auto; padding-left:3rem; } }
  `,
})
export class OrderProductListComponent {
  @Input({ required: true }) products: readonly OrderProduct[] = [];
  @Input() compact = true;
  @Input() showPrices = false;
}
