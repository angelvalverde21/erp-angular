import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CustomerService } from '../customer.service';
import { CustomerIndexComponent } from '../customer-index/customer-index.component';
import { loadContactDirectory } from '../../shared/contact-directory/load-contact-directory';
@Component({ selector: 'app-customer-index-page', imports: [RouterLink, CustomerIndexComponent], templateUrl: './customer-index-page.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class CustomerIndexPageComponent implements OnInit {
  private readonly service = inject(CustomerService);
  private readonly destroyRef = inject(DestroyRef);
  customers: any[] = [];
  loading = false; error = '';
  ngOnInit(): void { this.load(); }
  load(): void {
    if (this.loading) return;
    this.loading = true; this.error = '';
    loadContactDirectory(this.service).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading = false)).subscribe({
      next: records => this.customers = records,
      error: () => this.error = 'No se pudieron cargar los clientes. Vuelve a intentarlo.',
    });
  }
}
