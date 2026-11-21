import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { SupplierService } from '../supplier.service';
import { SupplierIndexComponent } from '../supplier-index/supplier-index.component';
import { loadContactDirectory } from '../../shared/contact-directory/load-contact-directory';
@Component({ selector: 'app-supplier-index-page', imports: [RouterLink, SupplierIndexComponent], templateUrl: './supplier-index-page.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class SupplierIndexPageComponent implements OnInit {
  private readonly service = inject(SupplierService);
  private readonly destroyRef = inject(DestroyRef);
  suppliers: any[] = [];
  loading = false; error = '';
  ngOnInit(): void { this.load(); }
  load(): void {
    if (this.loading) return;
    this.loading = true; this.error = '';
    loadContactDirectory(this.service).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading = false)).subscribe({
      next: records => this.suppliers = records,
      error: () => this.error = 'No se pudieron cargar los proveedores. Vuelve a intentarlo.',
    });
  }
}
