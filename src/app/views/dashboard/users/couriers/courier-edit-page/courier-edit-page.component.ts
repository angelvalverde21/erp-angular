import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, catchError, debounceTime, finalize, of, switchMap, takeUntil, tap } from 'rxjs';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HeadPageComponent } from '../../../../shared/components/head-page/head-page.component';
import { ButtonBackComponent } from '../../../../shared/components/buttons/button-back/button-back.component';
import { CourierService } from '../courier.service';
import { CourierEditComponent } from '../courier-edit/courier-edit.component';
import { AddressCreateComponent } from '../../../addresses/address-create/address-create.component';
import { AddressIndexComponent } from '../../../addresses/address-index/address-index.component';
import { Courier } from '../courier.model';

@Component({
  selector: 'app-courier-edit-page',
  imports: [FormsModule, HeadPageComponent, ButtonBackComponent, CourierEditComponent, AddressCreateComponent, AddressIndexComponent],
  templateUrl: './courier-edit-page.component.html',
  styleUrl: './courier-edit-page.component.scss'
})
export class CourierEditPageComponent implements OnInit, OnDestroy {
  courier?: Courier;
  addresses: any[] = [];
  loading = false;
  error = '';
  addressSearch = '';
  addressPage = 1;
  addressLastPage = 1;
  addressTotal = 0;
  addressLoading = false;
  addressError = '';
  private modal?: NgbModalRef;
  private addressRequests$ = new Subject<{ page: number; search: string }>();
  private destroy$ = new Subject<void>();

  constructor(
    private courierService: CourierService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.addressRequests$.pipe(
      debounceTime(250),
      tap(() => { this.addressLoading = true; this.addressError = ''; }),
      switchMap(({ page, search }) => this.courierService.addresses(this.courier!.id, page, search).pipe(
        catchError(() => {
          this.addressError = 'No se pudieron cargar las oficinas. Inténtalo nuevamente.';
          return of(null);
        }),
      )),
      takeUntil(this.destroy$),
    ).subscribe((response) => {
      this.addressLoading = false;
      if (!response) return;
      this.addresses = response.data;
      this.addressTotal = response.total;
      this.addressLastPage = response.last_page;
      if (this.addressPage > this.addressLastPage) {
        this.loadAddresses(this.addressLastPage);
      }
    });
    this.courierInit();
  }

  courierInit(): void {
    this.loading = true;
    this.error = '';
    this.courierService.get(this.route.snapshot.paramMap.get('courier_id')).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false),
    ).subscribe({
      next: (response) => {
        this.courier = response.data;
        this.loadAddresses();
      },
      error: () => this.error = 'No se pudo cargar el courier. Inténtalo nuevamente.',
    });
  }

  loadAddresses(page = 1): void {
    this.addressPage = page;
    this.addressLoading = true;
    this.addressRequests$.next({ page, search: this.addressSearch.trim() });
  }

  get addressPageNumbers(): number[] {
    const count = Math.min(5, this.addressLastPage);
    const start = Math.max(1, Math.min(this.addressPage - 2, this.addressLastPage - count + 1));
    return Array.from({ length: count }, (_, index) => start + index);
  }

  get addressFrom(): number {
    return this.addressTotal ? (this.addressPage - 1) * 20 + 1 : 0;
  }

  get addressTo(): number {
    return Math.min(this.addressPage * 20, this.addressTotal);
  }

  openOffice(content: TemplateRef<any>): void {
    this.modal = this.modalService.open(content, { centered: true, size: 'lg', backdrop: 'static' });
  }

  receiveCreateAddress(): void {
    if (this.courier) this.courier.addresses_count = (this.courier.addresses_count ?? 0) + 1;
    this.addressSearch = '';
    this.loadAddresses();
    this.modal?.close();
  }

  receiveUpdateAddress(): void {
    this.loadAddresses(this.addressPage);
  }

  receiveCourierUpdate(courier: Courier): void {
    this.courier = { ...this.courier, ...courier };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.addressRequests$.complete();
    this.modal?.dismiss();
  }
}
