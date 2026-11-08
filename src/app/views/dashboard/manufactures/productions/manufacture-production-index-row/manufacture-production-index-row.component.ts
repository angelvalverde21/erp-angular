import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  faScissors, faTape, faEdit,
  faGears, faBoxesStacked, faPlus, faMinus,
  faArrowRightArrowLeft, faTrash, faCartFlatbed,
  faMoneyBill1
} from '@fortawesome/free-solid-svg-icons';


import { DateShopifyPipe } from '@shared/pipes/date-shopify.pipe';
import { BaseService } from 'src/app/views/base.service';
import { ButtonMenuComponent } from 'src/app/views/shared/components/buttons/button-menu/button-menu.component';

@Component({
  selector: '[app-manufacture-production-index-row]',
  imports: [
    DateShopifyPipe,
    CommonModule,
    RouterModule,
    ButtonMenuComponent
  ],
  templateUrl: './manufacture-production-index-row.component.html',
  styleUrl: './manufacture-production-index-row.component.scss'
})
export class ManufactureProductionIndexRowComponent implements OnInit {

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

  menus: any[] = [];

  link_base: string[] = [];

  ngOnInit(): void {

    this.store = this._base.storeName ?? '';

    if (!this.production?.id) return;

    this.link_base = [
      '/',
      this.store,
      'dashboard',
      'manufactures',
      'productions',
      this.production.id
    ];

    this.menus = [
      {
        label: 'Editar',
        description: 'Datos de la producción',
        icon: this.faGears,
        routerLink: this.link_base,
        divider: true
      },
      {
        label: 'Compras',
        description: 'Compras y gastos asociados',
        icon: this.faMoneyBill1,
        routerLink: [...this.link_base, 'purchases']
      },
      {
        label: 'Inventario inicial',
        description: 'Variantes y unidades planificadas',
        icon: this.faScissors,
        routerLink: [...this.link_base, 'variants']
      },
      {
        label: 'Recepciones',
        description: 'Entradas y salidas de unidades',
        icon: this.faArrowRightArrowLeft,
        routerLink: [...this.link_base, 'kardexes']
      }
    ];

  }

  get variantLink() {
    return [...this.link_base, 'variants'];
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
