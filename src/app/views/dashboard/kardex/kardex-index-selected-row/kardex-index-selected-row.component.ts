import { Component, DestroyRef, EventEmitter, HostBinding, Input, OnInit, OnChanges, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ImagePreviewComponent } from 'src/app/views/shared/components/image-preview/image-preview.component';

@Component({
  selector: 'tr[app-kardex-index-selected-row]',
  imports: [ReactiveFormsModule, ImagePreviewComponent],
  templateUrl: './kardex-index-selected-row.component.html',
  styleUrl: './kardex-index-selected-row.component.scss',
})
export class KardexIndexSelectedRowComponent implements OnInit, OnChanges {
  @Input() variant: any;
  @Input() color_check = 'success';
  @Input() comments: string[] = [];
  @Input() disabled = false;
  @Input() initialValue?: { quantity: number; comment: string };
  @Output() emitVariantKardex = new EventEmitter<any>();
  private readonly destroyRef = inject(DestroyRef);
  form!: FormGroup;
  comment = '';
  readonly commentLabels: Record<string, string> = { Recepcion: 'Recepción', Correccion: 'Corrección' };

  constructor(private fb: FormBuilder) {}

  @HostBinding('class.row-selected') get selected(): boolean { return !!this.form?.valid && Number(this.form.get('quantity')?.value) >= 1; }
  get commentOptions(): string[] { return this.comments.length ? this.comments : [this.comment]; }
  get colorOption(): any { return (this.variant?.option_values || []).find((value: any) => value.option?.name?.toLowerCase() === 'color'); }
  get secondaryOptions(): any[] {
    const color = this.colorOption;
    return (this.variant?.option_values || []).filter((value: any) => value !== color);
  }
  get productName(): string {
    const name = this.variant?.product?.name || this.variant?.name || 'Variante #' + this.variant?.id;
    return this.colorOption?.value ? name + ' ' + this.colorOption.value : name;
  }
  get image(): any {
    const image = this.variant?.image || this.variant?.product?.image || this.variant?.product?.images?.[0];
    if (typeof image === 'string') return { url_thumbnail: image, url_large: image };
    if (!image) return null;
    const thumbnail = image.url_thumbnail || image.url_medium || image.url_large;
    return thumbnail ? { ...image, url_thumbnail: thumbnail } : null;
  }

  ngOnInit(): void {
    this.comment = this.comments[0] || ({ success: 'Recepcion', danger: 'Fallado', warning: 'Reparado' } as Record<string, string>)[this.color_check] || 'No determinado';
    this.formInit();
    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => this.emitVariantKardex.emit(value));
  }
  formInit(): void {
    this.form = this.fb.group({
      variant_id: [this.variant.id, Validators.required],
      quantity: [this.initialValue?.quantity ?? null, [Validators.required, Validators.min(1)]],
      comment: [this.initialValue?.comment || this.comment, Validators.required],
    });
  }
  ngOnChanges(): void { if (this.form && this.initialValue) this.form.patchValue(this.initialValue, { emitEvent: false }); }
  selectQuantity(event: FocusEvent): void { (event.target as HTMLInputElement).select(); }
}
