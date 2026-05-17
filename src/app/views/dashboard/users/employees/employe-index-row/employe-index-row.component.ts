import { PercentPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faIdBadge, faSackDollar, faUser, faCoins, faClock } from '@fortawesome/free-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseService } from 'src/app/views/base.service';
import { ButtonEditComponent } from 'src/app/views/shared/components/buttons/button-edit/button-edit.component';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';
import { StoreService } from 'src/app/views/stores/store.service';
import { PenPipe } from '@shared/pipes/pen.pipe'
@Component({
  selector: 'tr[app-employe-index-row]',
  imports: [
    PercentPipe,
    DateShopifyPipe,
    NgbDropdownModule,
    ButtonEditComponent,
    FontAwesomeModule,
    RouterModule,
    PenPipe
  ],
  templateUrl: './employe-index-row.component.html',
  styleUrl: './employe-index-row.component.scss'
})
export class EmployeIndexRowComponent implements OnInit {

  faIdBadge = faIdBadge;
  faSackDollar = faSackDollar;
  faUser = faUser;
  faCoins = faCoins;
  faClock = faClock;

  minuts_base = 14400;
  factor: number = 0;

  @Input() employee: any = {};

  store: string = '';

  constructor(
    private _base: BaseService
  ) {

    // console.log(this.store);

  }
  ngOnInit(): void {
    this.store = this._base.storeName || '';
    this.factor = this.employee.salary / this.minuts_base;

  }

}
