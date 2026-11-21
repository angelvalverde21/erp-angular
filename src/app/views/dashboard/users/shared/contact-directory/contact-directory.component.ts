import { Component, Input, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DateShopifyPipe } from '@shared/pipes/date-shopify.pipe';
import { ContactKind, ContactRow, contactRow } from './contact-directory.model';

@Component({
  selector: 'app-contact-directory', imports: [FormsModule, RouterLink, DateShopifyPipe],
  templateUrl: './contact-directory.component.html', styleUrls: ['../contact-ui.scss', './contact-directory.component.scss'],
})
export class ContactDirectoryComponent implements OnChanges {
  @Input() kind: ContactKind = 'supplier';
  @Input() records: readonly unknown[] = [];
  ngOnChanges(): void { this.rows = (this.records ?? []).map(record => contactRow(record, this.kind)); this.applyFilters(); }
  rows: ContactRow[] = [];
  filtered: ContactRow[] = [];
  query = '';
  status = 'all';
  page = 1;
  readonly pageSize = 20;
  get pages(): number { return Math.max(1, Math.ceil(this.filtered.length / this.pageSize)); }
  get visible(): ContactRow[] { return this.filtered.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }
  get first(): number { return this.filtered.length ? (this.page - 1) * this.pageSize + 1 : 0; }
  get last(): number { return Math.min(this.page * this.pageSize, this.filtered.length); }
  applyFilters(): void {
    const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
    const term = normalize(this.query.trim());
    this.filtered = this.rows.filter(row =>
      (this.status === 'all' || (this.status === 'active' ? row.active === true : row.active === false)) &&
      normalize([row.name, row.phone, row.email, row.document].join(' ')).includes(term));
    this.page = 1;
  }
  clear(): void { this.query = ''; this.status = 'all'; this.applyFilters(); }
}
