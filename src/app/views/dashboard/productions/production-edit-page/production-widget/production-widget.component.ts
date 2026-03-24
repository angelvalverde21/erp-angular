import { Component, Input, OnInit } from '@angular/core';
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { Router, RouterModule } from '@angular/router';
import { faBarcode, faBagShopping, faCalculator, faRightLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { PenPipe } from '@shared/pipes/pen.pipe';
import { BaseService } from 'src/app/views/base.service';

@Component({
  selector: 'app-production-widget',
  imports: [
    HeadPageComponent,
    ButtonLinkComponent,
    RouterModule,
    FontAwesomeModule,
    CommonModule,
    PenPipe
  ],
  templateUrl: './production-widget.component.html',
  styleUrl: './production-widget.component.scss'
})
export class ProductionWidgetComponent implements OnInit {

  faBarcode = faBarcode;
  faBagShopping = faBagShopping;
  faCalculator  = faCalculator;
  faRightLeft = faRightLeft;

  @Input() production_id: number = 0;
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
        value: (this.summary?.sum_variants > 0 ? (this.summary?.sum_purchases / this.summary?.sum_variants ? this.summary?.sum_purchases / this.summary?.sum_variants : 0) : 0),
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
        value: this.summary?.sum_variants ? this.summary?.sum_variants : 0,
        link: ['./variants'],
        icon: faCalculator,
        type: 'units'
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
