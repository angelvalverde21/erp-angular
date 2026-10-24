import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbAccordionModule, NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShopifyOrderFormComponent } from '../shopify-order-form/shopify-order-form.component';
import { VariantSearchComponent } from '@dashboard/products/variants/variant-search/variant-search.component';
import { ButtonAddComponent } from '@shared/components/buttons/button-add/button-add.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDolly, faTruck, faBarcode, faUser, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { CommonModule, JsonPipe } from '@angular/common';
import { CourierSearchComponent } from '@dashboard/users/couriers/courier-search/courier-search.component';
import { CourierSelectedComponent } from '@dashboard/users/couriers/courier-selected/courier-selected.component';
import { AddressFormComponent } from '@dashboard/addresses/address-form/address-form.component';
import { AddressCreateComponent } from '@dashboard/addresses/address-create/address-create.component';
import { OrderVariantIndexComponent } from '../order-variant-index/order-variant-index.component';
import { InputGroupComponent } from '@shared/components/form/input-group/input-group.component';
import { VoidIndexComponent } from '@shared/components/void-index/void-index.component';
import { ButtonSaveComponent } from '@shared/components/buttons/button-save/button-save.component';
import { ButtonCheckComponent } from 'src/app/views/shared/components/buttons/button-check/button-check.component';
import { TwoDecimalsDirective } from 'src/app/core/directives/two-decimals.directive';

@Component({
  selector: 'app-shopify-order-create',
  imports: [
    ReactiveFormsModule,
    ShopifyOrderFormComponent,
    VariantSearchComponent,
    ButtonAddComponent,
    FontAwesomeModule,
    JsonPipe,
    CommonModule,
    CourierSearchComponent,
    CourierSelectedComponent,
    AddressFormComponent,
    AddressCreateComponent,
    OrderVariantIndexComponent,
    InputGroupComponent,
    NgbAccordionModule,
    VoidIndexComponent,
    ButtonSaveComponent,
    ButtonCheckComponent,
    TwoDecimalsDirective,
  ],
  templateUrl: './shopify-order-create.component.html',
  styleUrl: './shopify-order-create.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ShopifyOrderCreateComponent {

  form!: FormGroup;
  modal: any;

  faDolly = faDolly;
  faTruck = faTruck;
  faBarcode = faBarcode;
  faUser = faUser;
  faPaperclip = faPaperclip;

  constructor(
    private fb: FormBuilder,
    config: NgbModalConfig,
    private modalService: NgbModal,
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  summary: any;

  ngOnInit(): void {
    this.formInit();
    // this.productSetup();
    // this.form.patchValue(this.product);
  }


  private formInit(): void {
    // this.form = this.fb.group({
    //   origin_id: ['', [Validators.required]],
    //   // color: ['', [Validators.required]],
    //   delivery_method_id: ['', [Validators.required]],
    //   contra_entrega: ['', [Validators.required]],
    //   acepta_pago_destino: ['', [Validators.required]],
    //   envio_es: ['', [Validators.required]],
    //   address: ['']
    // });

    this.form = this.fb.group({
      name: ['Angel Valverde', Validators.required],
      identity_id: [1, Validators.required],
      document_number: ['42412498', Validators.required],
      phone: ['943402809', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      primary: ['Urb Albino Herrera MZ H LT 16', Validators.required],
      secondary: ['1era etapa Callao'],
      references: ['Altura de la cuadra 8 de avenida pacasmayo'],
      district_id: ['70101', Validators.required],
      variants: this.fb.array([]), // Aquí se agregarán los variants del pedido
      courier_address_id: [null, Validators.required],
      delivery_cost: ['', Validators.required],
      is_cod: [null, Validators.required],
      freight_collect: [null, Validators.required],
      notes: this.fb.array([]),
    });

  }


  createOrderShopify() {

  }

  couriersInit() {

  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
  }
  ngOnDestroy(): void {
    this.noteModalRef?.dismiss();
    this.attachmentPreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    this.attachmentPreviews.clear();
    this.noteAttachmentErrors.clear();
  }

  closeModal() {
    this.modal.close();
  }


  // Getter para tipar mejor
  get variants(): FormArray<FormGroup> {
    return this.form.get('variants') as FormArray<FormGroup>;
  }

  noteAttachmentErrors = new Map<FormGroup, string[]>();
  attachmentPreviews = new Map<FormGroup, { url: string; isImage: boolean }>();

  get notes(): FormArray<FormGroup> {
    return this.form.get('notes') as FormArray<FormGroup>;
  }

  noteDraft: FormGroup | null = null;
  editingNote: FormGroup | null = null;
  private noteModalRef?: NgbModalRef;

  openNoteModal(content: TemplateRef<any>, note?: FormGroup): void {
    if (this.noteModalRef) return;
    const draft = this.fb.group({
      text: [note?.get('text')?.value ?? ''],
      category: [note?.get('category')?.value ?? 'sale'],
      attachments: this.fb.array([]),
    });
    // Each draft owns its previews so canceling never changes a saved note.
    if (note) {
      this.noteAttachments(note).controls.forEach(original => {
        const file = original.get('file')!.value as File;
        const attachment = this.fb.group({ file: [file] });
        this.noteAttachments(draft).push(attachment);
        this.attachmentPreviews.set(attachment, {
          url: URL.createObjectURL(file),
          isImage: /\.(jpe?g|png|webp|gif)$/i.test(file.name),
        });
      });
    }
    this.noteDraft = draft;
    this.editingNote = note ?? null;
    this.noteModalRef = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      scrollable: true,
      ariaLabelledBy: 'order-note-modal-title',
      ariaDescribedBy: 'order-note-modal-description',
    });
    this.noteModalRef.result.then(() => this.clearNoteDraft(draft), () => this.clearNoteDraft(draft));
  }

  get canSaveNote(): boolean {
    return !!this.noteDraft && (
      !!this.noteDraft.get('text')?.value?.trim() || this.noteAttachments(this.noteDraft).length > 0
    );
  }

  saveNote(): void {
    if (!this.noteDraft || !this.canSaveNote) return;
    const draft = this.noteDraft;
    draft.patchValue({ text: draft.get('text')!.value.trim() });
    if (this.editingNote) {
      const index = this.notes.controls.indexOf(this.editingNote);
      if (index < 0) return;
      this.noteAttachments(this.editingNote).controls.forEach(attachment => this.releaseAttachmentPreview(attachment));
      this.noteAttachmentErrors.delete(this.editingNote);
      this.notes.setControl(index, draft);
    } else {
      this.notes.push(draft);
    }
    this.noteAttachmentErrors.delete(draft);
    this.notes.markAsDirty();
    this.noteModalRef?.close();
  }

  private clearNoteDraft(draft: FormGroup): void {
    if (!this.notes.controls.includes(draft)) {
      this.noteAttachments(draft).controls.forEach(attachment => this.releaseAttachmentPreview(attachment));
    }
    this.noteAttachmentErrors.delete(draft);
    this.noteDraft = null;
    this.editingNote = null;
    this.noteModalRef = undefined;
  }

  noteCategoryLabel(note: FormGroup): string {
    switch (note.get('category')?.value) {
      case 'payment': return 'Pago';
      case 'shipping': return 'Envío';
      case 'sale': return 'Venta';
      default: return 'Otro';
    }
  }

  removeNote(index: number): void {
    if (index < 0 || index >= this.notes.length) return;
    const note = this.notes.at(index);
    this.noteAttachments(note).controls.forEach(attachment => this.releaseAttachmentPreview(attachment));
    this.noteAttachmentErrors.delete(note);
    this.notes.removeAt(index);
    this.notes.markAsDirty();
  }

  noteAttachments(note: FormGroup): FormArray<FormGroup> {
    return note.get('attachments') as FormArray<FormGroup>;
  }

  addAttachments(note: FormGroup, input: HTMLInputElement): void {
    const errors: string[] = [];
    this.noteAttachmentErrors.set(note, errors);
    const attachments = this.noteAttachments(note);
    const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']);

    for (const file of Array.from(input.files ?? [])) {
      const validExtension = /\.(jpe?g|png|webp|gif|pdf)$/i.test(file.name);
      if (!validExtension || (file.type && !allowedTypes.has(file.type))) {
        errors.push(`${file.name}: selecciona una imagen JPG, PNG, WEBP, GIF o un PDF.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: supera el máximo de 10 MB.`);
        continue;
      }
      if (file.size === 0) {
        errors.push(`${file.name}: el archivo está vacío.`);
        continue;
      }
      const duplicate = attachments.controls.some(control => {
        const existing = control.get('file')!.value as File;
        return existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified;
      });
      if (duplicate) {
        errors.push(`${file.name}: ya está adjunto en esta nota.`);
        continue;
      }

      const attachment = this.fb.group({ file: [file] });
      this.attachmentPreviews.set(attachment, {
        url: URL.createObjectURL(file),
        isImage: /\.(jpe?g|png|webp|gif)$/i.test(file.name),
      });
      attachments.push(attachment);
      attachments.markAsDirty();
    }
    // Allow selecting a removed or rejected file again.
    input.value = '';
  }

  private releaseAttachmentPreview(attachment: FormGroup): void {
    const preview = this.attachmentPreviews.get(attachment);
    if (preview) URL.revokeObjectURL(preview.url);
    this.attachmentPreviews.delete(attachment);
  }

  removeAttachment(note: FormGroup, index: number): void {
    const attachments = this.noteAttachments(note);
    if (index < 0 || index >= attachments.length) return;
    this.releaseAttachmentPreview(attachments.at(index));
    attachments.removeAt(index);
    attachments.markAsDirty();
    this.noteAttachmentErrors.delete(note);
  }

  formatAttachmentSize(bytes: number): string {
    return bytes < 1024 * 1024
      ? `${Math.max(1, Math.ceil(bytes / 1024))} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  variants_selected: any[] = []; // Aquí se almacenarán los variants seleccionados

  //Variantes seleccionadas
  receiveVariantsSelected(variants: any[]) {

    variants.forEach(variant => {

      const exists = this.variants.controls.find(control =>
        control.get('id')?.value === variant.id
      );

      if (exists) return;

      const group = this.fb.group({
        id: [variant.id],
        sku: [variant.sku],
        name: [variant.product.name],
        variant_option_values: [variant.variant_option_values],
        quantity: [variant.quantity || 1],
        price: [variant.price]
      });

      this.variants.push(group);

    });

    this.modal.close();

  }

  gotoVariants() {

    this.form.markAllAsTouched();

    // this.accordion.tooggle('second');

  }


  is_cod: boolean = false;
  freight_collect: boolean = false;
  delivery_type: string | null = null;

  receiveCourierSelected(courier: any) {
    
    // console.log('Courier seleccionado', courier);

    console.log('Courier seleccionado', courier);
    this.is_cod = courier.is_cod;
    this.freight_collect = courier.freight_collect; //pago en destino
    this.delivery_type = courier.delivery_type;
  }

  // Controles para guardar los datos del pedido

  @ViewChild('accordion') accordion: any;

  onNextButtonClick() {
    // Tu lógica aquí
    console.log('Botón Siguiente clickeado');
    
    // Toggle del accordion
    this.accordion.toggle('second');
  }
  
}
