import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PHOTO_SESSION_STATUSES, PhotoSession, PhotoSessionOptions, PhotoSessionPayload, PhotoSessionStatus } from '../photo-session.model';

@Component({
  selector: 'app-photo-session-create', imports: [ReactiveFormsModule], templateUrl: './photo-session-create.component.html',
  styleUrls: ['../photo-session.scss', './photo-session-create.component.scss'],
})
export class PhotoSessionCreateComponent implements OnChanges {
  @Input() session: PhotoSession | null = null;
  @Input() options: PhotoSessionOptions | null = null;
  @Input() saving = false;
  @Input() editing = false;
  @Output() save = new EventEmitter<PhotoSessionPayload>();
  readonly statuses = PHOTO_SESSION_STATUSES;
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(180)]], status: ['planned' as PhotoSessionStatus],
    shoot_date: [''], starts_at: [''], ends_at: [''], delivery_date: [''], responsible_id: [null as number | null],
    photographer_contact_id: [null as number | null], model_ids: [[] as number[]], photo_location_id: [null as number | null],
    photographer_ids: [[] as number[]], location_ids: [[] as number[]],
    location: ['', Validators.maxLength(255)], collection: ['', Validators.maxLength(255)], photographer: ['', Validators.maxLength(255)],
    team: ['', Validators.maxLength(5000)], brief: ['', Validators.maxLength(10000)], notes: ['', Validators.maxLength(10000)], budget: [null as number | null, Validators.min(0)],
  });
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['session'] && this.session) this.form.patchValue({ ...this.session, photographer_contact_id: this.session.photographer_contact_id ?? null, model_ids: this.session.model_ids ?? this.session.models?.map(model => model.id) ?? [], photo_location_id: this.session.photo_location_id ?? null,
      photographer_ids: this.session.photographer_ids ?? this.session.photographers?.map(contact => contact.id) ?? (this.session.photographer_contact_id ? [this.session.photographer_contact_id] : []),
      location_ids: this.session.location_ids ?? this.session.locations?.map(location => location.id) ?? (this.session.photo_location_id ? [this.session.photo_location_id] : []), shoot_date: this.session.shoot_date || '', delivery_date: this.session.delivery_date || '',
      starts_at: this.session.starts_at?.slice(0, 5) || '', ends_at: this.session.ends_at?.slice(0, 5) || '',
      location: this.session.location || '', collection: this.session.collection || '', photographer: this.session.photographer || '',
      team: this.session.team || '', brief: this.session.brief || '', notes: this.session.notes || '', budget: this.session.budget == null ? null : Number(this.session.budget) });
  }
  submit(): void {
    if (this.saving) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const raw = this.form.getRawValue();
    const nullable = (value: string) => value.trim() || null;
    this.save.emit({ ...raw, photographer_contact_id: raw.photographer_ids[0] ?? null, photo_location_id: raw.location_ids[0] ?? null, status: this.editing ? raw.status : 'planned', name: raw.name.trim(), shoot_date: nullable(raw.shoot_date), starts_at: nullable(raw.starts_at), ends_at: nullable(raw.ends_at),
      delivery_date: nullable(raw.delivery_date), location: nullable(raw.location), collection: nullable(raw.collection), photographer: nullable(raw.photographer),
      team: nullable(raw.team), brief: nullable(raw.brief), notes: nullable(raw.notes) });
  }
}
