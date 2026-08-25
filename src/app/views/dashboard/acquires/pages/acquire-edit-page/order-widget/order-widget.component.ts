import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { Router, RouterModule } from '@angular/router';
import { faBarcode, faBagShopping, faCalculator, faRightLeft, faSackDollar, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { PenPipe } from '@shared/pipes/pen.pipe';
import { BaseService } from 'src/app/views/base.service';


@Component({
  selector: 'app-order-widget',
  imports: [
    HeadPageComponent,
    ButtonLinkComponent,
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
        title: 'Inicio',
        subtitle: '',
        value: `${this.summary?.created_at}`,
        link: ['./'],
        exact: true,
        icon: faCalendar,
        type: 'date'
      },
      {
        title: 'Pedido Inicial',
        subtitle: `${this.summary?.count_variants} Variantes`,
        value: this.summary?.sum_variants ? this.summary?.sum_variants : 0,
        link: ['./variants'],
        icon: faCalculator,
        type: 'units'
      },
      {
        title: 'Pagos',
        subtitle: `${this.summary?.count_payments} Pagos`,
        value: this.summary?.sum_payments ? this.summary?.sum_payments : 0,
        link: ['./payments'],
        icon: faSackDollar,
        type: 'currency'
      },
      {
        title: 'Recepción',
        subtitle: 'Recibidos',
        value: this.summary?.sum_kardexes ? this.summary?.sum_kardexes : 0,
        link: ['./kardexes'],
        icon: faRightLeft,
        type: 'units'
      }
    ];
  }

}
