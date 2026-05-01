import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ButtonLinkComponent } from '@shared/components/buttons/button-link/button-link.component';
import { HeadPageComponent } from '@shared/components/head-page/head-page.component';
import { Router, RouterModule } from '@angular/router';
import { faBarcode, faBagShopping, faCalculator, faRightLeft, faIdBadge, faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { PenPipe } from '@shared/pipes/pen.pipe';
import { BaseService } from 'src/app/views/base.service';

@Component({
  selector: 'app-employee-widget',
  imports: [
    HeadPageComponent,
    ButtonLinkComponent,
    RouterModule,
    FontAwesomeModule,
    CommonModule,
    PenPipe
  ],
  templateUrl: './employee-widget.component.html',
  styleUrl: './employee-widget.component.scss'
})
export class EmployeeWidgetComponent implements OnInit {

  faBarcode = faBarcode;
  faRightLeft = faRightLeft;
  faIdBadge = faIdBadge;
  faSackDollar = faSackDollar;
  faBagShopping = faBagShopping;
  // @Input() employee_id: number = 0;
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


    // http://localhost:4200/sorelle/dashboard/manufactures/employees/1/purchases

    this.widgetsInit();
  }



  widgetsInit() {

    this.widgets = [
      {
        title: 'Resumen',
        subtitle: 'Por unidad',
        value: 0,
        link: ['./'],
        exact: true,
        icon: faBarcode,
        type: 'currency'
      },
      {
        title: 'Asistencias',
        subtitle: 'Faltas',
        value: 0,
        link: ['./attendances'],
        icon: faIdBadge,
        type: 'units'
      },
      {
        title: 'Pagos',
        subtitle: `Quincenales`,
        value: 0,
        link: ['./salaries'],
        icon: faSackDollar,
        type: 'currency'
      },
      {
        title: 'Gastos',
        subtitle: `Saldo global`,
        value: this.summary?.sum_payments || 0,
        link: ['./payments'],
        icon: faBagShopping,
        type: 'currency'
      }
    ];
  }

}
