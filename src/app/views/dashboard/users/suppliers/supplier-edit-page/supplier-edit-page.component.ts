import { Component, DestroyRef, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Subscription } from 'rxjs';
import { SupplierService } from '../supplier.service';
import { SupplierEditComponent } from '../supplier-edit/supplier-edit.component';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AddressIndexComponent } from '../../../addresses/address-index/address-index.component';
import { AddressCreateComponent } from '../../../addresses/address-create/address-create.component';
@Component({ selector: 'app-supplier-edit-page', imports: [RouterLink, SupplierEditComponent, AddressIndexComponent, AddressCreateComponent], templateUrl: './supplier-edit-page.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class SupplierEditPageComponent implements OnInit {
  private readonly service = inject(SupplierService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modals = inject(NgbModal);
  private modal?: NgbModalRef;
  supplier: any = null;
  roles: any[] = [];
  loading = false; error = '';
  private loadSubscription?: Subscription;

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.load());
  }
  load(): void {
    this.loadSubscription?.unsubscribe();
    const id = Number(this.route.snapshot.paramMap.get('supplier_id'));
    this.loading = true; this.error = '';
    this.loadSubscription = this.service.get(id).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading = false)).subscribe({
      next: response => this.supplier = response.data,
      error: () => this.error = 'No se pudo cargar la ficha del proveedor. Vuelve a intentarlo.',
    });
  }
  openVerticallyCentered(content: TemplateRef<unknown>): void { this.modal = this.modals.open(content, { centered: true, size: 'lg', backdrop: 'static' }); }
  receiveCreateAddress(address: any): void {
    this.supplier = { ...this.supplier, addresses: [address, ...(this.supplier.addresses ?? [])] };
    this.modal?.close();
  }
}
