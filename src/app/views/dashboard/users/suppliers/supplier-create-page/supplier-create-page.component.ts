import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupplierCreateComponent } from '../supplier-create/supplier-create.component';
@Component({ selector: 'app-supplier-create-page', imports: [RouterLink, SupplierCreateComponent], templateUrl: './supplier-create-page.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class SupplierCreatePageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  receiveSupplierCreate(record: any): void {
    if (record) void this.router.navigate(['../', record.id], { relativeTo: this.route });
  }
}
