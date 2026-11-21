import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';

/** Native modal shell. Closing hides content without destroying its work or queue. */
@Component({ selector: 'app-photo-dialog', templateUrl: './photo-dialog.component.html',
  styleUrls: ['../../photo-session.scss', './photo-dialog.component.scss'] })
export class PhotoDialogComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) title = '';
  @Input() description = '';
  @Input() icon = 'fa-camera';
  @Input() autoOpen = false;
  @Input() closeDisabled = false;
  @Input() plain = false;
  @Output() closed = new EventEmitter<void>();
  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  isClosing = false;
  private closing: Promise<void> | null = null;
  private exitAnimation?: Animation;
  ngAfterViewInit(): void { if (this.autoOpen) this.open(); }
  ngOnDestroy(): void { this.exitAnimation?.cancel(); this.dialog.nativeElement.close(); }
  open(): void {
    if (this.dialog.nativeElement.open || this.isClosing) return;
    this.exitAnimation?.cancel(); this.closing = null;
    this.dialog.nativeElement.classList.remove('closing'); this.dialog.nativeElement.showModal();
  }
  closeAnimated(): Promise<void> {
    if (!this.closing) { this.isClosing = true; this.closing = this.animateExit(); }
    return this.closing;
  }
  requestClose(): void {
    if (this.closeDisabled || this.isClosing) return;
    void this.closeAnimated().then(() => this.closed.emit());
  }
  onCancel(event: Event): void { event.preventDefault(); this.requestClose(); }
  private async animateExit(): Promise<void> {
    const dialog = this.dialog.nativeElement;
    if (dialog.open && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const style = getComputedStyle(dialog); dialog.classList.add('closing');
      this.exitAnimation = dialog.animate([{ opacity: style.opacity, transform: style.transform }, { opacity: 0, transform: 'translateY(12px) scale(.985)' }], { duration: 160, easing: 'ease-in', fill: 'forwards' });
      await this.exitAnimation.finished.catch(() => undefined);
    }
    if (dialog.open) dialog.close();
    this.isClosing = false;
  }
}
