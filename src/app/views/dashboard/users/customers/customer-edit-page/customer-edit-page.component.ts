import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, Subscription } from 'rxjs';
import { CustomerService } from '../customer.service';
import { CustomerEditComponent } from '../customer-edit/customer-edit.component';
import { RoleService } from '../../../roles/role.service';

@Component({ selector: 'app-customer-edit-page', imports: [RouterLink, CustomerEditComponent], templateUrl: './customer-edit-page.component.html', styleUrl: '../../shared/contact-ui.scss' })
export class CustomerEditPageComponent implements OnInit {
  private readonly service = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly roleService = inject(RoleService);
  customer: any = null;
  roles: any[] = [];
  loading = false; error = '';
  private loadSubscription?: Subscription;
  rolesError = false;
  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.load());
    this.loadRoles();
  }
  load(): void {
    this.loadSubscription?.unsubscribe();
    const id = Number(this.route.snapshot.paramMap.get('customer_id'));
    this.loading = true; this.error = '';
    this.loadSubscription = this.service.get(id).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading = false)).subscribe({
      next: response => this.customer = response.data,
      error: () => this.error = 'No se pudo cargar la ficha del cliente. Vuelve a intentarlo.',
    });
  }
  loadRoles(): void {
    this.rolesError = false;
    this.roleService.index().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response: any) => this.roles = response.data ?? [],
      error: () => this.rolesError = true,
    });
  }
}
