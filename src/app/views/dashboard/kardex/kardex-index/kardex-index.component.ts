import { CommonModule, JsonPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBarcode } from '@fortawesome/free-solid-svg-icons';
import { DateShopifyPipe } from 'src/app/views/shared/pipes/date-shopify.pipe';
import { KardexService } from '../kardex.service';

@Component({
  selector: 'app-kardex-index',
  imports: [
    JsonPipe,
    FontAwesomeModule,
    CommonModule,
    DateShopifyPipe
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
    private _kardex: KardexService
  ) {

  }

  ngOnInit(): void {


    // Inicializar la lista de variantes de kardex
    // this.balance = this.kardexes.reduce((acc, kardex) => acc + kardex.quantity * (kardex?.direction === 'in' ? 1 : -1), 0); //reduce, reduce el array a un numero;

    // this.fallados = this.kardexes.reduce((acc, kardex) => acc + (kardex.comment === 'Fallado' ? kardex.quantity : 0), 0);

    // this.reparados = this.kardexes.reduce((acc, kardex) => acc + (kardex.comment === 'Reparado' ? kardex.quantity : 0), 0);

    // this.saldo = this.fallados - this.reparados;

    this.kardex_summary = this._kardex.calculate(this.kardexes);

  }

  kardex_summary: any = null;

  ngOnChanges() {

    this.kardex_summary = this._kardex.calculate(this.kardexes);
    this.emitKardexSummary.emit(this.kardex_summary);
    // this.total_receptions = totals.total_receptions;
    // this.fallados = totals.fallados;
    // this.reparados = totals.reparados;
    // this.saldo = totals.saldo;

  }

}
