import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { PhotoExpenseTarget } from '../expenses/photo-expense.model';
import { RouterLink } from '@angular/router';
import { BaseService } from '../../../base.service';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';
import { PhotoAssignedContact } from '../photo-session.model';
import { PhotoLocation } from '../locations/photo-location.model';
import type { PhotoRelatedKind } from '../shared/photo-related-create-dialog/photo-related-create-dialog.component';
import { PhotoDialogComponent } from '../shared/photo-dialog/photo-dialog.component';

export interface PhotoAssignmentChange { kind: PhotoRelatedKind; ids: number[]; mode: 'attach' | 'detach'; }

@Component({ selector: 'app-photo-session-assignment-index', imports: [CurrencyPipe, NgTemplateOutlet, RouterLink, ImagePreviewComponent, PhotoDialogComponent],
  templateUrl: './photo-session-assignment-index.component.html',
  styleUrls: ['../photo-session.scss', './photo-session-assignment-index.component.scss'],
})
export class PhotoSessionAssignmentIndexComponent {
  @Input({ required: true }) kind!: PhotoRelatedKind;
  @Input() contacts: PhotoAssignedContact[] = [];
  @Input() locations: PhotoLocation[] = [];
  @Input() saving = false;
  @Input() expenseTotals: Record<string, number> = {};
  @Input() purchaseTotals: Record<string, number> = {};
  @Output() registerPayment = new EventEmitter<PhotoExpenseTarget>();
  @Output() changeAssignment = new EventEmitter<PhotoAssignmentChange>();
  @Output() createRelated = new EventEmitter<PhotoRelatedKind>();
  readonly base = inject(BaseService);
  pendingRemoval: { id: number; name: string; kind: PhotoRelatedKind } | null = null;
  get title() { return this.kind === 'location' ? 'Locaciones' : this.kind === 'model' ? 'Modelos' : 'Fotógrafos'; }
  get singular() { return this.kind === 'location' ? 'locación' : this.kind === 'model' ? 'modelo' : 'fotógrafo'; }
  get icon() { return this.kind === 'location' ? 'fa-location-dot' : this.kind === 'model' ? 'fa-user' : 'fa-camera'; }
  get path() { return this.kind === 'location' ? 'locations' : this.kind === 'model' ? 'models' : 'photographers'; }
  get assignedIds() { return this.kind === 'location' ? this.locations.map(item => item.id) : this.contacts.map(item => item.id); }
  remove(id: number): void {
    if (this.saving) return;
    const record = (this.kind === 'location' ? this.locations : this.contacts).find(item => item.id === id);
    if (record) this.pendingRemoval = { id, name: record.name, kind: this.kind };
  }
  confirmRemoval(): void {
    if (!this.pendingRemoval || this.saving) return;
    const { id, kind } = this.pendingRemoval;
    this.pendingRemoval = null;
    this.changeAssignment.emit({ kind, ids: [id], mode: 'detach' });
  }

  mapUrl(location: PhotoLocation): string | null {
    const address = location.address;
    if (address?.url_maps) {
      try {
        const url = new URL(address.url_maps);
        const isMaps = (['www.google.com', 'google.com'].includes(url.hostname) && url.pathname.startsWith('/maps'))
          || ['maps.google.com', 'maps.app.goo.gl'].includes(url.hostname)
          || (url.hostname === 'goo.gl' && url.pathname.startsWith('/maps/'));
        if (url.protocol === 'https:' && isMaps) return url.href;
      } catch { /* Fall back to the saved coordinates or address. */ }
    }
    const latitude = address?.latitud;
    const longitude = address?.longitud;
    let query: string;
    if (latitude != null && longitude != null && Number.isFinite(Number(latitude)) && Number.isFinite(Number(longitude))
      && Math.abs(Number(latitude)) <= 90 && Math.abs(Number(longitude)) <= 180) {
      query = `${latitude},${longitude}`;
    } else {
      const street = location.display_address || address?.primary;
      if (!street?.trim()) return null;
      query = [street, location.district_name || address?.district?.name, location.city_name || address?.city, 'Perú'].filter(Boolean).join(', ');
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
}
