import { RouterLink } from '@angular/router';
import { BranchFieldValidationDirective } from '../../branches/branch-field-validation.directive';
import { Component, EventEmitter, Input, OnDestroy, Optional, Output, TemplateRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BranchAddress, BranchPayload } from 'src/app/interfaces/branch.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddressCreateComponent } from '../../addresses/address-create/address-create.component';
import { AddressEditComponent } from '../../addresses/address-edit/address-edit.component';
import { AddressService } from '../../addresses/address.service';
import { bindAutomaticCode } from '../automatic-code';
import { finalize, Subscription } from 'rxjs';
@Component({ selector: 'app-branch-create', imports: [RouterLink, ReactiveFormsModule, BranchFieldValidationDirective, AddressCreateComponent, AddressEditComponent], templateUrl: './branch-create.component.html', styleUrl: './branch-create.component.scss' })
export class BranchCreateComponent implements OnDestroy {
  @Input() saving = false;
  @Input() editing = false;
  @Input() cancelPath = ['../'];
  @Input() submitLabel = 'Crear sucursal';
  @Input() addresses: BranchAddress[] = [];
  
  
  @Output() save = new EventEmitter<BranchPayload>();
  readonly form;
  private addressModal?: NgbModalRef;
  private readonly codeSubscription: Subscription;
  editingAddress: any = null;
  addressEditing = false;
  addressLoading = false;
  addressError = '';
  private addressRequest?: Subscription;

  constructor(private fb: FormBuilder, @Optional() private modalService?: NgbModal, @Optional() private addressService?: AddressService) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(/\S/)]],
      code: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(50)]],
      is_main: [false],
      address_id: [null as number | null],
      is_active: [true],
    });
    this.codeSubscription = bindAutomaticCode(this.form.controls.name, this.form.controls.code);
  }

  openAddressModal(content: TemplateRef<unknown>, edit = false): void {
    if (this.saving || !this.modalService) return;
    if (edit && (!this.form.controls.address_id.value || !this.addressService)) return;

    this.addressRequest?.unsubscribe();
    this.addressEditing = edit;
    this.editingAddress = null;
    this.addressLoading = edit;
    this.addressError = '';

    this.addressModal = this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      ariaLabelledBy: 'branch-address-modal-title',
      windowClass: 'branch-address-modal',
      scrollable: true,
    });

    if (edit) {
      this.addressRequest = this.addressService!.get(this.form.controls.address_id.value).pipe(
        finalize(() => this.addressLoading = false),
      ).subscribe({
        next: response => this.editingAddress = response.data,
        error: () => this.addressError = 'No se pudo cargar la dirección. Cierra el cuadro e inténtalo nuevamente.',
      });
    }
  }

  receiveCreateAddress(address: BranchAddress): void {
    this.addresses = [...this.addresses.filter(current => current.id !== address.id), address];
    this.form.controls.address_id.setValue(address.id);
    this.form.controls.address_id.markAsDirty();
    this.addressModal?.close();
  }

  ngOnDestroy(): void {
    this.addressRequest?.unsubscribe();
    this.codeSubscription.unsubscribe();
    this.addressModal?.dismiss();
  }

  submit(): void {
    if (this.saving) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const values = this.form.getRawValue();
    this.save.emit({ ...values, name: values.name.trim(), code: values.code.trim(),   });
  }
}
