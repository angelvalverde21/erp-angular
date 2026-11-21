import { SupplierAddressService } from '../../users/suppliers/supplier-address-selection/supplier-address.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AddressEditComponent } from '../address-edit/address-edit.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-address-index',
  imports: [
    AddressEditComponent,
    JsonPipe
  ],
  templateUrl: './address-index.component.html',
  styleUrl: './address-index.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class AddressIndexComponent implements OnInit, OnDestroy {

  @Input() addresses: any[] = [];
  @Input() user_id: number = 0;
  @Input() addressable_id: number = 0;
  @Input() addressable_type: string = '';
  @Output() emitUpdateAddress = new EventEmitter<any>();

  defaultSaving = false;
  defaultError = '';
  makeDefault(id: number): void {
    if (this.defaultSaving) return;
    this.defaultSaving = true; this.defaultError = '';
    this.supplierAddresses.makeDefault(this.addressable_id, id).subscribe({
      next: response => { this.addresses = response.data; this.defaultSaving = false; this.emitUpdateAddress.emit(response.data); },
      error: () => { this.defaultSaving = false; this.defaultError = 'No se pudo cambiar la direccion predeterminada.'; },
    });
  }
  modal: any;
  current_address: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private supplierAddresses: SupplierAddressService,
  ) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  

  openVerticallyCentered(content: TemplateRef<any>, address_id: number = 0) {

    this.modal = this.modalService.open(content, { centered: true, size: 'lg' });
    this.current_address = this.addresses.find(address => address.id === address_id);
    console.log(this.current_address);

  }

  receiveUpdateAddress(updatedAddress: any) {
    this.addresses = this.addresses.map(address =>
      address.id === updatedAddress.id ? updatedAddress : address
    );
    if (['courier', 'supplier'].includes(this.addressable_type)) {
      this.modal?.close();
    }
    this.emitUpdateAddress.emit(updatedAddress);
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (['courier', 'supplier'].includes(this.addressable_type)) {
      this.modal?.dismiss();
    }
  }

  closeModal() {
    this.modal.close();
  }

}


