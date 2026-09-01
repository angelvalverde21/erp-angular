import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faScissors, faTape, faEdit,
  faGears, faBoxesStacked, faPlus, faMinus,
  faArrowRightArrowLeft, faTrash, faCartFlatbed,
  faMoneyBill1, faSackDollar
} from '@fortawesome/free-solid-svg-icons';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { DateShopifyPipe } from '@shared/pipes/date-shopify.pipe';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { KardexRegisterInComponent } from '../../kardex/kardex-register-in/kardex-register-in.component';
import { KardexRegisterOutComponent } from '../../kardex/kardex-register-out/kardex-register-out.component';
import { BaseService } from 'src/app/views/base.service';
import { ButtonMenuComponent } from 'src/app/views/shared/components/buttons/button-menu/button-menu.component';

@Component({
  selector: '[app-acquire-index-row]',
  imports: [
    DateShopifyPipe,
    ButtonComponent,
    FontAwesomeModule,
    CommonModule,
    KardexRegisterInComponent,
    KardexRegisterOutComponent,
    NgbDropdownModule,
    RouterModule,
    NgbProgressbarModule,
    ButtonMenuComponent
  ],
  templateUrl: './acquire-index-row.component.html',
  styleUrl: './acquire-index-row.component.scss'
})
export class AcquireIndexRowComponent implements OnInit {

  faScissors = faScissors;
  faTape = faTape;
  faEdit = faEdit;
  faBoxesStacked = faBoxesStacked;
  faPlus = faPlus;
  faMinus = faMinus;
  faArrowRightArrowLeft = faArrowRightArrowLeft;
  faTrash = faTrash;
  faCartFlatbed = faCartFlatbed;
  faMoneyBill1 = faMoneyBill1;
  faGears = faGears;
  faSackDollar = faSackDollar;

  @Input() acquire: any;

  store: string | null = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _base: BaseService
  ) {

    this.store = this._base.store;

  }


  menus: any[] = [];

  link_base: string[] = [];

  ngOnInit() {

    this.store = this._base.storeName ?? '';

    this.link_base = ['/', this.store, 'dashboard', 'acquires', this.acquire.id];

    this.menus = [
      {
        label: 'Resumen',
        icon: this.faGears,
        routerLink: this.link_base,
        divider: true
      },
      {
        label: 'Pedido Inicial',
        icon: this.faScissors,
        routerLink: [...this.link_base, 'variants']
      },
      {
        label: 'Pagos',
        icon: this.faSackDollar,
        routerLink: [...this.link_base, 'payments']
      },
      {
        label: 'Recepciones',
        icon: this.faArrowRightArrowLeft,
        routerLink: [...this.link_base, 'kardexes']
      }
    ];
  }

  get variantLink() {
    return [...this.link_base];
  }

  cost(acquire: any) {
    return acquire.sum_variants > 0 ? (acquire.sum_purchases / acquire.sum_variants) : 0;
  }

  link: any;

  getProgress(acquire: any): number {
    if (!acquire?.sum_variants || acquire.sum_variants <= 0) {
      return 0;
    }

    const result =
      (acquire.sum_variants - acquire.sum_kardexes) /
      acquire.sum_variants;

    return Math.round(result * 100); // porcentaje
  }

}
