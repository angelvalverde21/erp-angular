import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Branch } from 'src/app/interfaces/branch.interface';
import { Warehouse } from 'src/app/interfaces/warehouse.interface';
import { BaseService } from '../../../base.service';

@Component({
  selector: 'app-branch-section-header',
  imports: [RouterLink],
  templateUrl: './branch-section-header.component.html',
  styleUrl: './branch-section-header.component.scss',
})
export class BranchSectionHeaderComponent {
  @Input() level: 'branches' | 'warehouses' | 'locations' = 'branches';
  @Input() title = '';
  @Input() description = '';
  @Input() creating = false;
  @Input() editing = false;
  @Input() branch: Branch | null = null;
  @Input() warehouse: Warehouse | null = null;

  constructor(private _base: BaseService) {}

  get root(): string[] { return ['/', this._base.store ?? '', 'dashboard', 'branches']; }
  get currentBranch(): Branch | null { return this.branch ?? this.warehouse?.branch ?? null; }
  get warehousePath(): (string | number)[] { return [...this.root, this.currentBranch?.id ?? this.warehouse?.branch_id ?? '', 'warehouses']; }
  get locationPath(): (string | number)[] { return [...this.warehousePath, this.warehouse?.id ?? '', 'locations']; }
  get branchEditPath(): (string | number)[] { return [...this.root, this.currentBranch?.id ?? '', 'edit']; }
  get warehouseEditPath(): (string | number)[] { return [...this.warehousePath, this.warehouse?.id ?? '', 'edit']; }
}
