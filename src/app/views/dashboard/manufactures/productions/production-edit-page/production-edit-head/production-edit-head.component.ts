import { Component, Input, OnInit } from '@angular/core';
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { WidgetCostComponent } from '../../../shared/widgets/widget-cost/widget-cost.component';
import { WidgetProductsComponent } from '../../../shared/widgets/widget-products/widget-products.component';
import { WidgetPurchasesComponent } from '../../../shared/widgets/widget-purchases/widget-purchases.component';
import { WidgetReceptionsComponent } from '../../../shared/widgets/widget-receptions/widget-receptions.component';
import { ManufactureWidgetsComponent } from '../../../shared/manufacture-widgets/manufacture-widgets.component';
import { Router, RouterModule } from '@angular/router';
import { WidgetComponent } from '../../widget/widget.component';
import { faBarcode, faBagShopping, faCalculator, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { BaseService } from '../../../../../base.service';
import { PenPipe } from '@shared/pipes/pen.pipe';

@Component({
  selector: 'app-production-edit-head',
  imports: [
    HeadPageComponent,
    ButtonLinkComponent,
    WidgetCostComponent,
    WidgetProductsComponent,
    WidgetPurchasesComponent,
    WidgetReceptionsComponent,
    ManufactureWidgetsComponent,
    RouterModule,
    FontAwesomeModule,
    CommonModule,
    PenPipe
  ],
  templateUrl: './production-edit-head.component.html',
  styleUrl: './production-edit-head.component.scss'
})
export class ProductionEditHeadComponent implements OnInit {

  faBarcode = faBarcode;
  faBagShopping = faBagShopping;
  faCalculator  = faCalculator;
  faRightLeft = faRightLeft;

  @Input() manufacture_id: number = 0;
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

  ngOnInit(): void {

    // http://localhost:4200/sorelle/dashboard/manufactures/productions/1/purchases

    this.widgets = [
      {
        title: 'Costo',
        subtitle: 'Por unidad',
        value: (this.summary?.sum_products > 0 ? (this.summary?.sum_purchases / this.summary?.sum_products ? this.summary?.sum_purchases / this.summary?.sum_products : 0) : 0),
        link: ['./'],
        exact: true,
        icon: faBarcode,
        type: 'currency'
      },
      {
        title: 'Compras',
        subtitle: 'Totales',
        value: this.summary?.sum_purchases  ? this.summary?.sum_purchases : 0,
        link: ['./purchases'],
        icon: faBagShopping,
        type: 'currency'
      },
      {
        title: 'Corte Total',
        subtitle: 'Cortados',
        value: this.summary?.sum_products ? this.summary?.sum_products : 0,
        link: ['./variants'],
        icon: faCalculator,
        type: 'units'
      },
      {
        title: 'Recepción',
        subtitle: 'Recibidos',
        value: this.summary?.sum_reception ? this.summary?.sum_reception : 0,
        link: ['./receptions'],
        icon: faRightLeft,
        type: 'units'
      }
    ];
  }



}
