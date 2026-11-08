import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryAdjustment } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryStatusComponent } from '../../inventory-status/inventory-status.component';
@Component({ selector: 'app-inventory-adjustment-index', imports: [DatePipe, RouterLink, InventoryStatusComponent], templateUrl: './inventory-adjustment-index.component.html', styleUrl: './inventory-adjustment-index.component.scss' })
export class InventoryAdjustmentIndexComponent { @Input() records: InventoryAdjustment[] = []; }
