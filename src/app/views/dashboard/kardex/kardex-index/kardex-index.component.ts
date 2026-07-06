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

    this.kardex_summary = this._kardex.summary(this.kardexesFlat);

  }

  kardex_summary: any = null;

  ngOnChanges() {

    this.kardex_summary = this._kardex.summary(this.kardexesFlat);
    this.emitKardexSummary.emit(this.kardex_summary);


    // this.total_receptions = totals.total_receptions;
    // this.fallados = totals.fallados;
    // this.reparados = totals.reparados;
    // this.saldo = totals.saldo;

  }

  get kardexGroups(): any[] {
    if (this.kardexes.length === 0) return [];

    if (Array.isArray(this.kardexes[0]?.items)) {
      return this.kardexes;
    }

    return this.kardexes.reduce((groups: any[], kardex: any) => {
      const date = this.fechaGrupo(kardex?.created_at);
      const group = groups.find((item) => item.date === date);

      if (group) {
        group.items.push(kardex);
      } else {
        groups.push({ date, items: [kardex] });
      }

      return groups;
    }, []);
  }

  get kardexesFlat(): any[] {
    return this.kardexGroups.flatMap((group) => group.items);
  }

  private fechaGrupo(value: string | null | undefined): string {
    if (!value) return '';

    return value.split('T')[0].split(' ')[0];
  }

  sum_group_quantity(group: any): number {
    return group.items.reduce((acc: number, item: any) => {
      const quantity = Number(item.quantity) || 0;

      if (item.direction === 'in') {
        return acc + quantity;
      }

      if (item.direction === 'out') {
        return acc - quantity;
      }

      return acc;
    }, 0);
  }
}
