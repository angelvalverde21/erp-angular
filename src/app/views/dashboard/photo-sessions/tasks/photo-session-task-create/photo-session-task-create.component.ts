import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PhotoTask, PhotoTaskPlanning } from '../photo-session-task.model';

@Component({
  selector: 'app-photo-session-task-create', imports: [ReactiveFormsModule],
  templateUrl: './photo-session-task-create.component.html',
  styleUrls: ['../../photo-session.scss', './photo-session-task-create.component.scss'],
})
export class PhotoSessionTaskCreateComponent implements OnChanges {
  @Input() task: PhotoTask | null = null;
  @Input() assignees: { id: number; name: string }[] = [];
  @Input() saving = false;
  @Output() save = new EventEmitter<PhotoTaskPlanning>();
  @Output() cancel = new EventEmitter<void>();
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({ title: ['', [Validators.required, Validators.maxLength(180)]], description: ['', Validators.maxLength(5000)],
    assigned_to: [null as number | null, Validators.required], due_date: [''] });
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) this.form.patchValue({ ...this.task, description: this.task.description || '', due_date: this.task.due_date || '' });
  }
  submit(): void {
    if (this.saving) return;
    if (this.form.invalid || !this.form.controls.title.value.trim()) { this.form.markAllAsTouched(); return; }
    const value = this.form.getRawValue();
    this.save.emit({ title: value.title.trim(), description: value.description.trim() || null, assigned_to: value.assigned_to!, due_date: value.due_date || null });
  }
}
