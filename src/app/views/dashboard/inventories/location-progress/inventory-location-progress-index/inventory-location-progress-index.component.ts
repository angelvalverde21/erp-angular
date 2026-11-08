import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryLocationProgress } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryStatusComponent } from '../../inventory-status/inventory-status.component';
@Component({ selector: 'app-inventory-location-progress-index', imports: [DatePipe, RouterLink, InventoryStatusComponent], templateUrl: './inventory-location-progress-index.component.html', styleUrl: './inventory-location-progress-index.component.scss' })
export class InventoryLocationProgressIndexComponent { @Input() records: InventoryLocationProgress[] = []; }
