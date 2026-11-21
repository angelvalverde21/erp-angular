import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { BaseService } from '../../../base.service';
import { ImagePreviewComponent } from '../../../shared/components/image-preview/image-preview.component';
import { PhotoAssignedContact } from '../photo-session.model';
import { PhotoLocation } from '../locations/photo-location.model';
import type { PhotoRelatedKind } from '../shared/photo-related-create-dialog/photo-related-create-dialog.component';

export interface PhotoAssignmentChange { kind: PhotoRelatedKind; ids: number[]; mode: 'attach' | 'detach'; }

@Component({ selector: 'app-photo-session-assignment-index', imports: [FormsModule, RouterLink, NgSelectModule, ImagePreviewComponent],
  templateUrl: './photo-session-assignment-index.component.html',
  styleUrls: ['../photo-session.scss', './photo-session-assignment-index.component.scss'],
})
export class PhotoSessionAssignmentIndexComponent {
  @Input({ required: true }) kind!: PhotoRelatedKind;
  @Input() contacts: PhotoAssignedContact[] = [];
  @Input() locations: PhotoLocation[] = [];
  @Input() options: { id: number; name: string; active: boolean }[] = [];
  @Input() saving = false;
  @Output() changeAssignment = new EventEmitter<PhotoAssignmentChange>();
  @Output() createRelated = new EventEmitter<PhotoRelatedKind>();
  readonly base = inject(BaseService);
  choosing = false; selectedIds: number[] = [];
  get title() { return this.kind === 'location' ? 'Locaciones' : this.kind === 'model' ? 'Modelos' : 'Fotógrafos'; }
  get singular() { return this.kind === 'location' ? 'locación' : this.kind === 'model' ? 'modelo' : 'fotógrafo'; }
  get icon() { return this.kind === 'location' ? 'fa-location-dot' : this.kind === 'model' ? 'fa-user' : 'fa-camera'; }
  get path() { return this.kind === 'location' ? 'locations' : this.kind === 'model' ? 'models' : 'photographers'; }
  get assignedIds() { return this.kind === 'location' ? this.locations.map(item => item.id) : this.contacts.map(item => item.id); }
  get availableOptions() { const assigned = new Set(this.assignedIds); return this.options.filter(option => !assigned.has(option.id)); }
  attach(): void {
    if (!this.selectedIds.length || this.saving) return;
    this.changeAssignment.emit({ kind: this.kind, ids: this.selectedIds, mode: 'attach' });
    this.choosing = false; this.selectedIds = [];
  }
  remove(id: number): void { if (!this.saving) this.changeAssignment.emit({ kind: this.kind, ids: [id], mode: 'detach' }); }

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
