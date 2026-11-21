import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PHOTO_CONTACT_LABELS, PhotoContact, PhotoContactKind, PhotoContactPayload } from '../photo-contact.model';

@Component({
  selector: 'app-photo-contact-create', imports: [ReactiveFormsModule], templateUrl: './photo-contact-create.component.html',
  styleUrls: ['../../photo-session.scss', './photo-contact-create.component.scss'],
})
export class PhotoContactCreateComponent implements OnChanges {
  @Input() kind: PhotoContactKind = 'photographer';
  @Input() contact: PhotoContact | null = null;
  @Input() saving = false;
  @Input() editing = false;
  @Output() save = new EventEmitter<PhotoContactPayload>();
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({ name: ['', [Validators.required, Validators.maxLength(180)]],
    phone: ['', Validators.maxLength(40)], email: ['', [Validators.email, Validators.maxLength(255)]], instagram: ['', Validators.maxLength(120)],
    portfolio_url: ['', [Validators.pattern(/^https?:\/\/\S+$/i), Validators.maxLength(500)]], company: ['', Validators.maxLength(255)], notes: ['', Validators.maxLength(5000)], active: [true] });
  get labels() { return PHOTO_CONTACT_LABELS[this.kind]; }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contact'] && this.contact) this.form.patchValue({ ...this.contact, phone: this.contact.phone || '', email: this.contact.email || '', instagram: this.contact.instagram || '', portfolio_url: this.contact.portfolio_url || '', company: this.contact.company || '', notes: this.contact.notes || '' });
  }
  submit(): void {
    if (this.saving) return;
    if (this.form.invalid || !this.form.controls.name.value.trim()) { this.form.markAllAsTouched(); return; }
    const data = this.form.getRawValue(); const optional = (value: string) => value.trim() || null;
    this.save.emit({ ...data, kind: this.kind, name: data.name.trim(), phone: optional(data.phone), email: optional(data.email), instagram: optional(data.instagram), portfolio_url: optional(data.portfolio_url), company: optional(data.company), notes: optional(data.notes) });
  }
}
