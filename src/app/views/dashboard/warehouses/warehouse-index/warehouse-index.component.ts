import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Warehouse } from 'src/app/interfaces/warehouse.interface';
@Component({ selector: 'app-warehouse-index', imports: [RouterLink], templateUrl: './warehouse-index.component.html', styleUrl: './warehouse-index.component.scss' })
export class WarehouseIndexComponent { @Input() warehouses: Warehouse[] = []; }
