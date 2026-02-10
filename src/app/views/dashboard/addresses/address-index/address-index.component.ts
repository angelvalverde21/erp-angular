import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
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

  modal: any;
  current_address: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
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
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  closeModal() {
    this.modal.close();
  }

}


