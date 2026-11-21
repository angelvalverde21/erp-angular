import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PHOTO_LOCATION_TYPES, PHOTO_RATE_UNITS, PhotoLocation } from '../photo-location.model';

@Component({ selector: 'app-photo-location-index', imports: [RouterLink, DecimalPipe], templateUrl: './photo-location-index.component.html',
  styleUrls: ['../../photo-session.scss', './photo-location-index.component.scss'] })
export class PhotoLocationIndexComponent {
  @Input() locations: readonly PhotoLocation[] = [];
  typeIcon(value: string): string { return PHOTO_LOCATION_TYPES.find(type => type.value === value)?.icon || 'fa-location-dot'; }
  typeLabel(value: string): string { return PHOTO_LOCATION_TYPES.find(type => type.value === value)?.label || value; }
  rateLabel(value: string): string { return PHOTO_RATE_UNITS.find(unit => unit.value === value)?.label.toLowerCase() || value; }
}
