import { DestroyRef, Directive, EventEmitter, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Observable } from 'rxjs';
import { contactError, ContactKind } from './contact-directory/contact-directory.model';
import { addressLocationControls } from '../../addresses/address-form/address-form.model';

interface ContactService {
  store(payload: any): Observable<any>;
  update(id: number, payload: any): Observable<any>;
}
/** Shared save lifecycle; each create/edit component retains its own API service and event. */
@Directive()
export abstract class ContactEditor {
  protected abstract service: ContactService;
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  @Input() roles: any[] = [];
  @Input() button_text = '';
  readonly saved = new EventEmitter<any>();
  form!: FormGroup;
  loadingIcon = false;
  error = '';
  success = '';
  private editing = false;
  private recordId = 0;
  private completed = false;

  protected initialize(kind: ContactKind, record?: any): void {
    this.editing = !!record;
    this.recordId = record?.id ?? 0;
    const data = record?.user ?? record ?? {};
    const roles = (data.roles ?? []).map((role: any) => typeof role === 'string' ? role : role.name);
    this.form = this.fb.group({
      name: [data.name ?? '', [Validators.required, Validators.maxLength(255)]],
      email: [data.email ?? '', [Validators.email, Validators.maxLength(255), ...(kind === 'customer' ? [Validators.required] : [])]],
      phone: [data.phone ?? '', [Validators.maxLength(20), ...(kind === 'supplier' && !record ? [Validators.required] : [])]],
      document_number: [data.document_number ?? '', Validators.maxLength(20)],
      ...(kind === 'supplier' ? { identity_id: [data.identity_id ?? null] } : {}),
      ...(record ? { status: [Number(data.status ?? 1), Validators.required] } : {}),
      ...(kind === 'supplier' && !record ? addressLocationControls(this.fb) : {}),
      ...(kind === 'customer' && record ? { roles: [roles, roles.length ? Validators.required : []] } : {}),
    });
  }

  get disabledButton(): boolean { return this.loadingIcon || this.completed || !!this.form?.invalid; }
  create(): void { this.submit(); }
  update(): void { this.submit(); }
  protected preparePayload(value: Record<string, any>): Record<string, any> { return value; }
  submit(): void {
    if (this.loadingIcon || this.completed) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    for (const key of ['name', 'email', 'phone', 'document_number', 'primary', 'secondary', 'references']) {
      if (typeof value[key] === 'string') value[key] = value[key].trim();
    }
    const payload = this.preparePayload(value);
    if (Array.isArray(payload['roles']) && !payload['roles'].length) delete payload['roles'];
    this.loadingIcon = true; this.error = ''; this.success = '';
    this.form.disable({ emitEvent: false });
    const request = this.editing ? this.service.update(this.recordId, payload) : this.service.store(payload);
    request.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => {
      this.loadingIcon = false; this.form.enable({ emitEvent: false });
    })).subscribe({
      next: response => {
        this.completed = !this.editing;
        this.form.markAsPristine();
        this.success = this.editing ? 'Cambios guardados correctamente.' : 'Registro creado correctamente.';
        this.saved.emit(response.data);
      },
      error: error => this.error = contactError(error),
    });
  }
}
