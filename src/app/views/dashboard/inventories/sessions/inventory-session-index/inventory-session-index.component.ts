import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InventorySession } from 'src/app/interfaces/inventory-session.interface';
import { InventoryStatusComponent } from '../../inventory-status/inventory-status.component';
@Component({ selector: 'app-inventory-session-index', imports: [DatePipe, RouterLink, InventoryStatusComponent], templateUrl: './inventory-session-index.component.html', styleUrl: './inventory-session-index.component.scss' })
export class InventorySessionIndexComponent { @Input() sessions: InventorySession[] = []; }
