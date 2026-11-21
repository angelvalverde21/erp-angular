import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PHOTO_LOCATION_TYPES, PHOTO_RATE_UNITS, PhotoLocation, PhotoLocationPayload, PhotoLocationType } from '../photo-location.model';
import { InputDistrictIdComponent } from '../../../addresses/input-district-id/input-district-id.component';

@Component({ selector: 'app-photo-location-create', imports: [ReactiveFormsModule, InputDistrictIdComponent], templateUrl: './photo-location-create.component.html',
  styleUrls: ['../../photo-session.scss', './photo-location-create.component.scss'] })
export class PhotoLocationCreateComponent implements OnChanges {
  @Input() location: PhotoLocation | null = null;
  @Input() saving = false;
  @Input() editing = false;
  @Output() save = new EventEmitter<PhotoLocationPayload>();
  readonly types = PHOTO_LOCATION_TYPES;
  readonly rateUnits = PHOTO_RATE_UNITS;
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(180)]], type: ['studio' as PhotoLocationType],
    address: this.fb.nonNullable.group({
      primary: ['', Validators.maxLength(500)], secondary: ['', Validators.maxLength(255)], references: ['', Validators.maxLength(255)],
      district_id: [null as number | null], city: ['', Validators.maxLength(255)],
      url_maps: ['', [Validators.pattern(/^https?:\/\/\S+$/i), Validators.maxLength(1000)]],
      latitud: [null as number | null, [Validators.min(-90), Validators.max(90)]], longitud: [null as number | null, [Validators.min(-180), Validators.max(180)]],
    }),
    contact_name: ['', Validators.maxLength(180)], phone: ['', Validators.maxLength(40)], email: ['', [Validators.email, Validators.maxLength(255)]],
    reference_url: ['', [Validators.pattern(/^https?:\/\/\S+$/i), Validators.maxLength(1000)]], rate: [null as number | null, Validators.min(0)],
    rate_unit: ['hour' as 'hour' | 'day' | 'session'], notes: ['', Validators.maxLength(5000)], active: [true],
  });
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['location'] && this.location) this.form.patchValue({ ...this.location, address: {
      primary: this.location.address?.primary || '', secondary: this.location.address?.secondary || '', references: this.location.address?.references || '',
      district_id: this.location.address?.district_id ?? null, city: this.location.address?.city || '', url_maps: this.location.address?.url_maps || '',
      latitud: this.location.address?.latitud == null ? null : Number(this.location.address.latitud), longitud: this.location.address?.longitud == null ? null : Number(this.location.address.longitud),
    },
      contact_name: this.location.contact_name || '', phone: this.location.phone || '', email: this.location.email || '', reference_url: this.location.reference_url || '',
      rate: this.location.rate == null ? null : Number(this.location.rate), notes: this.location.notes || '' });
  }
  submit(): void {
    if (this.saving) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue(); const optional = (text: string) => text.trim() || null;
    const address = { ...value.address, primary: optional(value.address.primary), secondary: optional(value.address.secondary), references: optional(value.address.references),
      city: optional(value.address.city), url_maps: optional(value.address.url_maps) };
    this.save.emit({ ...value, name: value.name.trim(), address: Object.values(address).some(field => field !== null && field !== '') ? address : null,
      contact_name: optional(value.contact_name), phone: optional(value.phone), email: optional(value.email), reference_url: optional(value.reference_url), notes: optional(value.notes) });
  }
}
