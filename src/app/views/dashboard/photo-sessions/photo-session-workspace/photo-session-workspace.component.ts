import { Component, ElementRef, EventEmitter, Input, Output, inject } from '@angular/core';
import { PhotoAssignedContact, PhotoSession, PhotoSessionOptions } from '../photo-session.model';
import { CurrencyPipe } from '@angular/common';
import { PhotoExpenseTarget } from '../expenses/photo-expense.model';
import { PhotoExpenseDialogComponent } from '../expenses/photo-expense-dialog.component';
import { PhotoSessionTaskIndexComponent } from '../tasks/photo-session-task-index/photo-session-task-index.component';
import { PhotoTaskSummary } from '../tasks/photo-session-task.model';
import { PhotoSessionDashboardComponent } from '../photo-session-dashboard/photo-session-dashboard.component';
import { PHOTO_SESSION_SECTIONS, PhotoSessionSection, photoSessionSectionCount } from '../photo-session-workspace.model';
import { PhotoSessionAssignmentIndexComponent, PhotoAssignmentChange } from '../photo-session-assignment-index/photo-session-assignment-index.component';
import type { PhotoRelatedKind } from '../shared/photo-related-create-dialog/photo-related-create-dialog.component';

@Component({ selector: 'app-photo-session-workspace', imports: [CurrencyPipe, PhotoExpenseDialogComponent, PhotoSessionDashboardComponent, PhotoSessionTaskIndexComponent, PhotoSessionAssignmentIndexComponent],
  templateUrl: './photo-session-workspace.component.html', styleUrls: ['../photo-session.scss', './photo-session-workspace.component.scss'],
})
export class PhotoSessionWorkspaceComponent {
  @Input({ required: true }) session!: PhotoSession;
  @Input() options: PhotoSessionOptions | null = null;
  @Input() saving = false;
  @Input() editing = false;
  @Input() assetCount: number | null = null;
  @Output() changeAssignment = new EventEmitter<PhotoAssignmentChange>();
  @Output() createRelated = new EventEmitter<PhotoRelatedKind>();
  private readonly host: ElementRef<HTMLElement> = inject(ElementRef);
  readonly sections = PHOTO_SESSION_SECTIONS;
  activeSection: PhotoSessionSection = 'session';
  expenseTarget: PhotoExpenseTarget | null = null;
  get totalPaid(): number { return Object.values(this.session.expense_totals || {}).reduce((sum, total) => sum + Number(total), 0); }
  get totalPurchases(): number { return Object.values(this.session.purchase_totals || {}).reduce((sum, total) => sum + Number(total), 0); }
  paymentSaved(event: { target: PhotoExpenseTarget; total: number; cost: number }): void {
    this.session.expense_totals = { ...this.session.expense_totals, [event.target.kind + ':' + event.target.id]: event.total };
    this.session.purchase_totals = { ...this.session.purchase_totals, [event.target.kind + ':' + event.target.id]: event.cost };
  }
  taskSummary: PhotoTaskSummary | null = null;
  taskState = { loading: true, error: '' };
  get photographers(): PhotoAssignedContact[] { return this.session.photographers || (this.session.photographer_contact ? [this.session.photographer_contact] : []); }
  count(section: PhotoSessionSection): number { return photoSessionSectionCount(section, this.session, this.taskSummary, this.assetCount); }
  goTo(section: PhotoSessionSection): void {
    this.activeSection = section;
  }
  navigateTabs(event: KeyboardEvent): void {
    const current = this.sections.findIndex(section => section.key === this.activeSection);
    let next: number;
    switch (event.key) {
      case 'ArrowRight': next = (current + 1) % this.sections.length; break;
      case 'ArrowLeft': next = (current - 1 + this.sections.length) % this.sections.length; break;
      case 'Home': next = 0; break;
      case 'End': next = this.sections.length - 1; break;
      default: return;
    }
    event.preventDefault();
    this.goTo(this.sections[next].key);
    this.host.nativeElement.querySelector<HTMLButtonElement>('#session-nav-' + this.activeSection)?.focus();
  }
}
