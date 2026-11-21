import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerCreateComponent } from '../customer-create/customer-create.component';
@Component({ selector: 'app-customer-create-page', imports: [RouterLink, CustomerCreateComponent], templateUrl: './customer-create-page.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class CustomerCreatePageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  receiveCustomerCreate(record: any): void {
    if (record) void this.router.navigate(['../', record.user_id ?? record.user?.id ?? record.id], { relativeTo: this.route });
  }
}
