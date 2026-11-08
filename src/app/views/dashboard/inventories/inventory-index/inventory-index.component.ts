import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Inventory } from 'src/app/interfaces/inventory.interface';
import { InventoryStatusComponent } from '../inventory-status/inventory-status.component';
@Component({ selector: 'app-inventory-index', imports: [DatePipe, RouterLink, InventoryStatusComponent], templateUrl: './inventory-index.component.html', styleUrl: './inventory-index.component.scss' })
export class InventoryIndexComponent {
  @Input() inventories: Inventory[] = [];
  readonly scopeLabels = { branch: 'Sucursal', warehouse: 'Almacén', location: 'Ubicación' };
}
