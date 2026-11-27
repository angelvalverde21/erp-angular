import { AfterViewInit, Component, DestroyRef, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PurchaseIndexComponent } from '../../purchases/purchase-index/purchase-index.component';
import { PurchaseCreateComponent } from '../../purchases/purchase-create/purchase-create.component';
import { PhotoExpenseService } from './photo-expense.service';
import { PhotoExpenseContext, PhotoExpenseTarget } from './photo-expense.model';
import { photoSessionError } from '../photo-session.model';

@Component({ selector: 'app-photo-expense-dialog', imports: [PurchaseCreateComponent, PurchaseIndexComponent, CurrencyPipe, DatePipe],
  templateUrl: './photo-expense-dialog.component.html', styleUrls: ['../photo-session.scss', './photo-expense-dialog.component.scss'] })
export class PhotoExpenseDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) sessionId!: number;
  @Input({ required: true }) target!: PhotoExpenseTarget;
  @Output() closed = new EventEmitter<void>();
  @Output() paid = new EventEmitter<{ target: PhotoExpenseTarget; total: number; cost: number }>();
  @ViewChild('content', { static: true }) content!: TemplateRef<unknown>;
  private readonly api = inject(PhotoExpenseService);
  private readonly modals = inject(NgbModal);
  private readonly destroyRef = inject(DestroyRef);
  private modal?: NgbModalRef;
  context: PhotoExpenseContext | null = null;
  loading = false; error = '';
  ngOnInit(): void { this.load(); }
  ngAfterViewInit(): void {
    this.modal = this.modals.open(this.content, { size: 'xl', scrollable: true, centered: true, backdrop: 'static', keyboard: false });
    this.modal.result.catch(() => undefined);
    this.modal.hidden.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.closed.emit());
  }
  close(): void { this.modal?.close(); }
  load(closeAfter = false): void {
    if (this.loading) return;
    this.loading = true; this.error = '';
    this.api.context(this.sessionId, this.target).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading = false)).subscribe({
      next: response => {
        this.context = response.data;
        this.paid.emit({ target: this.target, total: this.context.total_paid, cost: this.context.total_purchases });
        if (closeAfter) this.close();
      }, error: error => this.error = photoSessionError(error),
    });
  }
  ngOnDestroy(): void { this.modal?.close(); }
}
