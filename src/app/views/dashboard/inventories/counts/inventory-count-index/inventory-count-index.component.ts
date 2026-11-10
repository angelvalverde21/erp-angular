import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventoryCount } from 'src/app/interfaces/inventory-workspace.interface';
import { InventoryStatusComponent } from '../../inventory-status/inventory-status.component';

@Component({
  selector: 'app-inventory-count-index',
  imports: [DatePipe, UpperCasePipe, RouterLink, InventoryStatusComponent],
  templateUrl: './inventory-count-index.component.html',
  styleUrl: './inventory-count-index.component.scss',
})
export class InventoryCountIndexComponent {
  @Input() records: InventoryCount[] = [];
  @Input() canDelete = false;
  @Input() currentUserId?: number;
  @Input() deletingId: number | null = null;
  @Input() deleteBusy = false;
  @Output() deleteCapture = new EventEmitter<InventoryCount>();
}
