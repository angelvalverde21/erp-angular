import { CommonModule } from '@angular/common';
import { ManufactureCollectionBadgeComponent } from '../../components/manufacture-collection-badge/manufacture-collection-badge.component';
import { Component, EventEmitter, Input, OnInit, Output, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { ManufactureProductionService } from '../manufacture.production.service';
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
    ManufactureCollectionBadgeComponent,
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
  @Output() deleted = new EventEmitter<number>();
  deleting = false;
  private readonly productionService = inject(ManufactureProductionService);
  private readonly destroyRef = inject(DestroyRef);
  private destroyed = false;
  get destructiveAction(): 'delete' | 'archive' | 'restore' {
    return this.production.archived_at ? 'restore' : (this.production.can_delete === false || this.production.sum_kardexes > 0 ? 'archive' : 'delete');
  }
  async deleteProduction(): Promise<void> {
    if (this.deleting) return;
    this.deleting = true;
    const action = this.destructiveAction;
    const title = action === 'delete' ? '¿Eliminar producción?' : (action === 'archive' ? '¿Archivar producción?' : '¿Restaurar producción?');
    const text = action === 'delete' ? `Se eliminará «${this.production.name}» con sus compras, pagos y procesos. Los productos y variantes del catálogo se conservarán.`
      : action === 'archive' ? `«${this.production.name}» pasará a Archivadas. Se conservarán su stock, compras, pagos e historial.` : `«${this.production.name}» volverá al listado de producciones activas.`;
    const result = await Swal.fire({ title, text, icon: 'warning', showCancelButton: true, confirmButtonText: action === 'delete' ? 'Eliminar producción' : (action === 'archive' ? 'Archivar' : 'Restaurar'), cancelButtonText: 'Cancelar', confirmButtonColor: action === 'delete' ? '#b34454' : '#7055ad' });
    if (!result.isConfirmed || this.destroyed) { this.deleting = false; return; }
    const request = action === 'delete' ? this.productionService.destroy(this.production.id) : this.productionService.setArchived(this.production.id, action === 'archive');
    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => { this.deleting = false; this.deleted.emit(this.production.id); },
      error: error => {
        this.deleting = false;
        const message = error?.error?.errors ? Object.values(error.error.errors).flat().join(' ') : error?.error?.message || 'No se pudo eliminar la producción. Intenta nuevamente.';
        void Swal.fire(action === 'delete' ? 'No se pudo eliminar' : 'No se pudo actualizar', message, 'error');
      },
    });
  }

  store: string | null = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _base: BaseService
  ) {

    this.store = this._base.store;
    this.destroyRef.onDestroy(() => this.destroyed = true);

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
        routerLink: [...this.link_base, 'details'],
        divider: true
      },
      {
        label: 'Secciones',
        description: 'Procesos, compras e historial',
        icon: this.faMoneyBill1,
        routerLink: [...this.link_base, 'overview']
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

  get manageLink() {
    return [...this.link_base, 'overview'];
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
