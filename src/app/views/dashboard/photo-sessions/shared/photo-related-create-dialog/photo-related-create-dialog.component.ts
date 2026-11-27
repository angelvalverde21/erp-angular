import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { PhotoContactCreateComponent } from '../../contacts/photo-contact-create/photo-contact-create.component';
import { PhotoContactPayload } from '../../contacts/photo-contact.model';
import { PhotoLocationCreateComponent } from '../../locations/photo-location-create/photo-location-create.component';
import { PhotoLocationPayload } from '../../locations/photo-location.model';
import { PhotoDialogComponent } from '../photo-dialog/photo-dialog.component';
import { FormsModule } from '@angular/forms';

export type PhotoRelatedKind = 'photographer' | 'model' | 'location';

@Component({ selector: 'app-photo-related-create-dialog', imports: [FormsModule, PhotoContactCreateComponent, PhotoLocationCreateComponent, PhotoDialogComponent],
  templateUrl: './photo-related-create-dialog.component.html', styleUrls: ['../../photo-session.scss', './photo-related-create-dialog.component.scss'] })
export class PhotoRelatedCreateDialogComponent {
  @Input({ required: true }) kind!: PhotoRelatedKind;
  @Input() saving = false;
  @Input() error = '';
  @Input() allowSelection = false;
  @Input() options: { id: number; name: string; active: boolean }[] = [];
  @Input() assignedIds: number[] = [];
  @Output() selectionSave = new EventEmitter<number[]>();
  @Output() contactSave = new EventEmitter<PhotoContactPayload>();
  @Output() locationSave = new EventEmitter<PhotoLocationPayload>();
  @Output() cancel = new EventEmitter<void>();
  @ViewChild(PhotoDialogComponent) private modal?: PhotoDialogComponent;
  mode: 'select' | 'create' = 'select';
  search = '';
  selectedIds: number[] = [];
  get singular(): string { return this.kind === 'location' ? 'locación' : this.kind === 'model' ? 'modelo' : 'fotógrafo'; }
  get availableOptions() { const assigned = new Set(this.assignedIds); return this.options.filter(option => !assigned.has(option.id)); }
  get filteredOptions() {
    const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().trim();
    const term = normalize(this.search);
    return this.availableOptions.filter(option => normalize(option.name).includes(term));
  }
  ngOnChanges(): void {
    const available = new Set(this.availableOptions.map(option => option.id));
    this.selectedIds = this.selectedIds.filter(id => available.has(id));
  }
  toggleSelection(id: number, selected: boolean): void {
    if (this.saving || this.isClosing) return;
    this.selectedIds = selected ? [...new Set([...this.selectedIds, id])] : this.selectedIds.filter(value => value !== id);
  }
  submitSelection(): void {
    if (this.saving || this.isClosing || !this.selectedIds.length) return;
    this.selectionSave.emit([...this.selectedIds]);
  }
  get isClosing(): boolean { return this.modal?.isClosing || false; }
  get title(): string { return this.allowSelection ? `Agregar ${this.singular}` : this.kind === 'location' ? 'Nueva locación' : this.kind === 'model' ? 'Registrar modelo' : 'Registrar fotógrafo'; }
  get icon(): string { return this.kind === 'location' ? 'fa-location-dot' : this.kind === 'model' ? 'fa-user' : 'fa-camera'; }
  closeAnimated(): Promise<void> { return this.modal?.closeAnimated() || Promise.resolve(); }
  requestClose(): void { this.modal?.requestClose(); }
}
