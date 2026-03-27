import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faScissors, faTape, faEdit,
  faGears, faBoxesStacked, faPlus, faMinus,
  faArrowRightArrowLeft, faTrash, faCartFlatbed,
  faMoneyBill1
} from '@fortawesome/free-solid-svg-icons';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';


import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { DateShopifyPipe } from '@shared/pipes/date-shopify.pipe';
import { BaseService } from '../../../base.service';
import { KardexRegisterInComponent } from '../../kardex/kardex-register-in/kardex-register-in.component';
import { KardexRegisterOutComponent } from '../../kardex/kardex-register-out/kardex-register-out.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: '[app-production-index-row]',
  imports: [
    DateShopifyPipe,
    ButtonComponent,
    FontAwesomeModule,
    CommonModule,
    KardexRegisterInComponent,
    KardexRegisterOutComponent,
    NgbDropdownModule,
    RouterModule,
    NgbProgressbarModule
  ],
  templateUrl: './production-index-row.component.html',
  styleUrl: './production-index-row.component.scss'
})
export class ProductionIndexRowComponent {

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

  @Input() production: any;

  store: string | null = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _base: BaseService
  ) {

    this.store = this._base.store;

  }

  cost(production: any) {
    return production.sum_variants > 0 ? (production.sum_purchases / production.sum_variants) : 0;
  }

  link: any;

  getProgress(production: any): number {
    if (!production?.sum_variants || production.sum_variants <= 0) {
      return 0;
    }

    const result =
      (production.sum_variants - production.sum_kardexes) /
      production.sum_variants;

    return Math.round(result * 100); // porcentaje
  }

}
