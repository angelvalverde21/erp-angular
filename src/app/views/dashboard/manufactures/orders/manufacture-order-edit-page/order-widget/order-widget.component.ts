import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { faBarcode, faBagShopping, faCalculator, faRightLeft, faSackDollar, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { PenPipe } from '@shared/pipes/pen.pipe';
import { BaseService } from 'src/app/views/base.service';


@Component({
  selector: 'app-order-widget',
  imports: [
    RouterModule,
    FontAwesomeModule,
    CommonModule,
    PenPipe
  ],
  templateUrl: './order-widget.component.html',
  styleUrl: './order-widget.component.scss'
})
export class OrderWidgetComponent implements OnInit {

  faBarcode = faBarcode;
  faBagShopping = faBagShopping;
  faCalculator = faCalculator;
  faRightLeft = faRightLeft;
  faSackDollar = faSackDollar;
  faCalendar = faCalendar;

  @Input() order_id: number = 0;
  @Input() summary: any = null;

  widgets: any[] = [];

  store: string | null = '';

  constructor(
    private router: Router,
    private _base: BaseService
  ) {
    this.store = this._base.store;
  }

  isActive(link: any[], exact = false): boolean {

    const currentUrl = this.router.url.split('?')[0];

    const targetUrl = this.router.serializeUrl(
      this.router.createUrlTree(link)
    );

    if (exact) {
      return currentUrl === targetUrl;
    }

    return currentUrl.startsWith(targetUrl);

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['summary']) {
      this.widgetsInit();
    }
  }

  ngOnInit(): void {


    // http://localhost:4200/sorelle/dashboard/manufactures/productions/1/purchases

    this.widgetsInit();
  }



  widgetsInit() {

    this.widgets = [
      {
        title: 'Monto total pedido',
        subtitle: `${this.summary?.count_variants ?? 0} variantes · Unidades pedidas`,
        value: this.summary?.sum_variants ? this.summary?.sum_variants : 0,
        link: ['./variants'],
        icon: faCalculator,
        type: 'units',
        showCost: true,
        estimatedCost: this.summary?.estimated_order_cost_valid === false ? null : this.summary?.estimated_order_cost ?? null,
        costValid: this.summary?.estimated_order_cost_valid !== false,
        zeroCostVariants: this.summary?.zero_cost_variants ?? 0,
        pending: this.summary?.has_pending_cost ?? false,
      },
      {
        title: 'Pagos',
        subtitle: `${this.summary?.count_payments ?? 0} pagos registrados`,
        value: this.summary?.sum_payments ? this.summary?.sum_payments : 0,
        link: ['./payments'],
        icon: faSackDollar,
        type: 'currency'
      },
      {
        title: 'Recepción',
        subtitle: Number(this.summary?.pending_reception_units) > 0
          ? `${Number(this.summary.pending_reception_units)} pendientes de ingreso al kardex`
          : 'Unidades recibidas',
        value: (Number(this.summary?.sum_kardexes) || 0) + (Number(this.summary?.pending_reception_units) || 0),
        link: ['./kardexes'],
        icon: faRightLeft,
        type: 'units'
      }
    ];
  }

}
