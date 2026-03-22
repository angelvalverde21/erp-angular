import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faScissors, faTape, faEdit,
  faGears, faBoxesStacked, faPlus, faMinus,
  faArrowRightArrowLeft, faTrash, faCartFlatbed,
  faMoneyBill1
} from '@fortawesome/free-solid-svg-icons';


import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { DateShopifyPipe } from '@shared/pipes/date-shopify.pipe';
import { BaseService } from '../../../base.service';
import { KardexRegisterInComponent } from '../../kardex/kardex-register-in/kardex-register-in.component';
import { KardexRegisterOutComponent } from '../../kardex/kardex-register-out/kardex-register-out.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tr[app-manufacture-index-row]',
  imports: [
    DateShopifyPipe,
    ButtonComponent,
    FontAwesomeModule,
    CommonModule,
    KardexRegisterInComponent,
    KardexRegisterOutComponent,
    NgbDropdownModule
  ],
  templateUrl: './manufacture-index-row.component.html',
  styleUrl: './manufacture-index-row.component.scss'
})
export class ManufactureIndexRowComponent {

  faScissors = faScissors;
  faTape = faTape;
  faEdit = faEdit;
  faGears = faGears;
  faBoxesStacked = faBoxesStacked;
  faPlus = faPlus;
  faMinus = faMinus;
  faArrowRightArrowLeft = faArrowRightArrowLeft;
  faTrash = faTrash;
  faCartFlatbed = faCartFlatbed;
  faMoneyBill1 = faMoneyBill1;

  @Input() manufacture: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _base: BaseService
  ) { }


  link: any;

  getReceptions(manufacture: any) {
    if (manufacture.type == 'order') {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'orders', this.manufacture.id, 'receptions'];
    } else {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'productions', this.manufacture.id, 'receptions'];
    }
    return this.router.navigate(this.link);
  }

  getPurchases(manufacture: any) {
    if (manufacture.type == 'order') {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'orders', this.manufacture.id, 'purchases'];
    } else {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'productions', this.manufacture.id, 'purchases'];
    }
    return this.router.navigate(this.link);
  }

  getVariants(manufacture: any) {
    if (manufacture.type == 'order') {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'orders', this.manufacture.id, 'variants'];
    } else {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'productions', this.manufacture.id, 'variants'];
    }

    return this.router.navigate(this.link);
  }


}
