import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faScissors, faTape, faEdit, faGears, faBoxesStacked, faPlus, faMinus, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '@shared/components/buttons/button/button.component';
import { DateShopifyPipe } from '@shared/pipes/date-shopify.pipe';
import { BaseService } from '../../../base.service';
import { KardexRegisterInComponent } from '../../kardex/kardex-register-in/kardex-register-in.component';
import { KardexRegisterOutComponent } from '../../kardex/kardex-register-out/kardex-register-out.component';

@Component({
  selector: 'tr[app-manufacture-index-row]',
  imports: [
    DateShopifyPipe,
    ButtonComponent,
    FontAwesomeModule,
    CommonModule,
    KardexRegisterInComponent,
    KardexRegisterOutComponent
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

  @Input() manufacture: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _base: BaseService
  ) { }


  link: any;

  getManufactureId(manufacture: any) {


    if (manufacture.type == 'order') {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'orders', this.manufacture.id];
    } else {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'productions', this.manufacture.id];
    }

    return this.router.navigate(this.link);

  }

  getManufactureReceptionId(manufacture: any) {
    if (manufacture.type == 'order') {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'orders', this.manufacture.id, 'receptions'];
    } else {
      this.link = [this._base.store, 'dashboard', 'manufactures', 'productions', this.manufacture.id, 'receptions'];
    }

    return this.router.navigate(this.link);

  }


}
