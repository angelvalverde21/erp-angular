import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Inventory } from 'src/app/interfaces/inventory.interface';
import { InventorySession } from 'src/app/interfaces/inventory-session.interface';
import { BaseService } from '../../../base.service';
import { InventoryStatusComponent } from '../inventory-status/inventory-status.component';
@Component({ selector: 'app-inventory-section-header', imports: [RouterLink, InventoryStatusComponent], templateUrl: './inventory-section-header.component.html', styleUrl: './inventory-section-header.component.scss' })
export class InventorySectionHeaderComponent {
  @Input() inventory: Inventory | null = null;
  @Input() sessions = false;
  @Input() session: InventorySession | null = null;
  @Input() workspace: 'sessions' | 'progress' | 'counts' | 'adjustments' = 'sessions';
  @Input() title = '';
  @Input() description = '';
  @Input() compact = false;
  get root(): string[] { return ['/', this._base.store ?? '', 'dashboard', 'inventories']; }
  get inventoryPath(): (string | number)[] { return [...this.root, this.inventory?.id ?? '']; }
  get sessionsPath(): (string | number)[] { return [...this.inventoryPath, 'sessions']; }
  get progressPath(): (string | number)[] { return [...this.inventoryPath, 'location-progress']; }
  get adjustmentsPath(): (string | number)[] { return [...this.inventoryPath, 'adjustments']; }
  get inventoryEditPath(): (string | number)[] { return [...this.inventoryPath, 'edit']; }
  get sessionEditPath(): (string | number)[] { return [...this.sessionsPath, this.session?.id ?? '', 'edit']; }
  get sectionLabel(): string { return !this.sessions ? 'Control de inventario' : ({ sessions: 'Jornadas de trabajo', progress: 'Avance por ubicación', counts: 'Conteo físico', adjustments: 'Diferencias de inventario' })[this.workspace]; }
  get sectionIcon(): string { return !this.sessions ? 'fa-solid fa-clipboard-list' : ({ sessions: 'fa-solid fa-stopwatch', progress: 'fa-solid fa-map-location-dot', counts: 'fa-solid fa-list-check', adjustments: 'fa-solid fa-scale-balanced' })[this.workspace]; }
  constructor(private _base: BaseService) {}
}
