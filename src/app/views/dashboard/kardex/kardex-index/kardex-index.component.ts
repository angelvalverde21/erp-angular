import { CommonModule, JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';
import { KardexService } from '../kardex.service';
import { ImageShopifyComponent } from '../../../shared/components/image-shopify/image-shopify.component';
import { RouterModule } from '@angular/router';
import { BaseService } from 'src/app/views/base.service';

@Component({
  selector: 'app-kardex-index',
  imports: [
    JsonPipe,
    FontAwesomeModule,
    CommonModule,
    DateShopifyPipe,
    ImageShopifyComponent,
    RouterModule
  ],
  templateUrl: './kardex-index.component.html',
  styleUrl: './kardex-index.component.scss'
})
export class KardexIndexComponent implements OnInit {

  faBarcode = faBarcode;
  total_receptions: number = 0;

  @Output() emitKardexSummary = new EventEmitter<any>();

  fallados: number = 0;
  reparados: number = 0
  saldo: number = 0

  @Input() kardexes: any[] = [];
  @Input() text_balance: string = 'Balance'; 

  constructor(
    private _kardex: KardexService,
    private _base: BaseService
  ) {

  }

  store: string = "";

  ngOnInit(): void {

    this.store = this._base.store!;

    this.kardex_summary = this._kardex.summary(this.kardexes);

  }

  kardex_summary: any = null;

  ngOnChanges() {

    this.kardex_summary = this._kardex.summary(this.kardexes);
    this.emitKardexSummary.emit(this.kardex_summary);

    
    // this.total_receptions = totals.total_receptions;
    // this.fallados = totals.fallados;
    // this.reparados = totals.reparados;
    // this.saldo = totals.saldo;

  }

}
